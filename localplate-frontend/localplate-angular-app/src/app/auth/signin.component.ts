import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../services/auth.service';
import { GoogleIdentityService } from '../services/google-identity.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavBarComponent, FooterComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  @ViewChild('googleButtonContainer') googleButtonContainer?: ElementRef<HTMLDivElement>;

  form = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordsMatch }
  );

  otpForm = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  submitting = false;
  showOtpVerify = false;
  verifyEmail = '';
  errorMessage = '';
  successMessage = '';
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

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('password')?.value;
    const cpw = control.get('confirmPassword')?.value;
    return pw && cpw && pw === cpw ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = String(this.form.value.email);
    const password = String(this.form.value.password);

    this.authService.signup(email, password).subscribe({
      next: (res) => {
        this.submitting = false;
        this.verifyEmail = email;
        this.showOtpVerify = true;
        this.successMessage = 'Registration initiated! Please enter the 6-digit OTP code sent to your email.';
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const code = String(this.otpForm.value.code);

    this.authService.verifySignup(this.verifyEmail, code).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Email verified successfully! Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Verification failed. Please check the code and try again.';
      }
    });
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
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.googleLogin(credential).subscribe({
      next: (res) => {
        this.submitting = false;
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Google sign-in failed. Please try again.';
      }
    });
  }
}

