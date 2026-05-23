import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { AuthService } from '../services/auth.service';
import { GoogleIdentityService } from '../services/google-identity.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent, NavBarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('googleButtonContainer') googleButtonContainer?: ElementRef<HTMLDivElement>;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  otpForm = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submitting = false;
  authError: string | null = null;
  successMessage: string | null = null;

  showOtpVerify = false;
  showForgotPassword = false;
  loginEmail = '';
  googleError = '';
  googleLoading = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private googleIdentityService: GoogleIdentityService
  ) {}

  ngAfterViewInit(): void {
    this.setupGoogleSignIn();
  }

  ngOnDestroy(): void {
    this.googleButtonContainer?.nativeElement.replaceChildren();
  }

  get f() {
    return this.form.controls;
  }

  get o() {
    return this.otpForm.controls;
  }

  get fg() {
    return this.forgotForm.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.authError = null;
    this.successMessage = null;

    const email = String(this.form.value.email);
    const password = String(this.form.value.password);

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.status === '2FA_REQUIRED') {
          this.loginEmail = email;
          this.showOtpVerify = true;
          this.successMessage = 'Credentials accepted! Please enter the 6-digit OTP code sent to your email.';
        }
      },
      error: (err) => {
        this.submitting = false;
        this.authError = err.error?.error || 'Authentication failed. Please verify your credentials.';
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.authError = null;
    this.successMessage = null;

    const code = String(this.otpForm.value.code);

    this.authService.verifyLogin(this.loginEmail, code).subscribe({
      next: (res) => {
        this.submitting = false;
        this.authService.saveToken(res.token);
        this.successMessage = 'Login successful! Redirecting to admin panel...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      },
      error: (err) => {
        this.submitting = false;
        this.authError = err.error?.error || 'Invalid OTP code. Please try again.';
      }
    });
  }

  onForgotPassword(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.authError = null;
    this.successMessage = null;

    const email = String(this.forgotForm.value.email);

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'If your email is registered, we have dispatched a password recovery email.';
        this.forgotForm.reset();
      },
      error: (err) => {
        this.submitting = false;
        this.authError = 'An error occurred. Please try again.';
      }
    });
  }

  toggleForgotPassword(show: boolean): void {
    this.showForgotPassword = show;
    this.authError = null;
    this.successMessage = null;
    this.form.reset();
    this.forgotForm.reset();
    if (!show) {
      setTimeout(() => this.setupGoogleSignIn(), 0);
    }
  }

  private setupGoogleSignIn(): void {
    this.googleError = '';
    this.googleLoading = true;

    const container = this.googleButtonContainer?.nativeElement;
    if (!container) {
      return;
    }

    this.authService.getGoogleConfig().subscribe({
      next: ({ clientId, enabled }) => {
        this.googleLoading = false;
        if (!enabled || !clientId) {
          this.googleError = 'Google sign-in is not configured yet. Set GOOGLE_CLIENT_ID in the backend environment.';
          return;
        }

        this.googleIdentityService.renderButton(
          container,
          clientId,
          (credential) => this.handleGoogleCredential(credential),
          'continue_with'
        ).catch((error: Error) => {
          this.googleError = error.message || 'Unable to load Google sign-in.';
        });
      },
      error: () => {
        this.googleLoading = false;
        this.googleError = 'Unable to load Google sign-in configuration.';
      }
    });
  }

  private handleGoogleCredential(credential: string): void {
    this.submitting = true;
    this.authError = null;
    this.successMessage = null;

    this.authService.googleLogin(credential).subscribe({
      next: (res) => {
        this.submitting = false;
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting = false;
        this.authError = err.error?.error || 'Google sign-in failed. Please try again.';
      }
    });
  }
}

