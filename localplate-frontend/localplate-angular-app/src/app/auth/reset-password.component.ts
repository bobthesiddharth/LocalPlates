import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavBarComponent, FooterComponent],
  template: `
    <app-nav-bar></app-nav-bar>
    <div class="auth-page">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-card" novalidate>
        <h2>Reset Password</h2>
        <p class="subtitle" style="text-align: center; margin-bottom: 20px; color: var(--text-muted);">
          Please enter and confirm your new password below.
        </p>

        <div class="error" *ngIf="errorMessage" style="margin-bottom:14px; text-align: center;">{{ errorMessage }}</div>
        <div class="success" *ngIf="successMessage" style="margin-bottom:14px; color: #2ecc71; text-align: center; font-weight: 600;">{{ successMessage }}</div>

        <label class="field" *ngIf="!successMessage">
          <span>New Password</span>
          <input type="password" formControlName="password" />
          <div class="error" *ngIf="f.password.touched && f.password.invalid">
            <div *ngIf="f.password.errors?.['required']">Password is required.</div>
            <div *ngIf="f.password.errors?.['minlength']">Password must be at least 6 characters.</div>
          </div>
        </label>

        <label class="field" *ngIf="!successMessage">
          <span>Confirm New Password</span>
          <input type="password" formControlName="confirmPassword" />
          <div class="error" *ngIf="(f.confirmPassword.touched || form.touched) && form.errors?.['mismatch']">Passwords do not match.</div>
        </label>

        <button type="submit" class="btn" [disabled]="form.invalid || submitting" *ngIf="!successMessage">
          {{ submitting ? 'Updating Password...' : 'Save Password' }}
        </button>

        <p class="muted" style="margin-top: 16px;"><a routerLink="/login">Back to Login</a></p>
      </form>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .auth-page {
      padding: 140px 24px 80px;
      min-height: 85vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at top right, rgba(242, 106, 79, 0.08), transparent 50%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--card-bg, #fff);
      padding: 32px;
      border-radius: 20px;
      box-shadow: var(--shadow-lg, 0 12px 32px rgba(45, 42, 38, 0.12));
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .auth-card h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-dark, #2d2a26);
      margin-bottom: 8px;
      text-align: center;
      letter-spacing: -0.03em;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 18px;
    }
    .field span {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #7c7365);
    }
    .field input {
      padding: 12px 16px;
      font-size: 0.95rem;
      border-radius: 10px;
      border: 1px solid rgba(45, 42, 38, 0.12);
      outline: none;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.8);
      font-family: inherit;
    }
    .field input:focus {
      border-color: var(--primary, #f26a4f);
      box-shadow: 0 0 0 3px rgba(242, 106, 79, 0.15);
      background: #fff;
    }
    .btn {
      width: 100%;
      padding: 14px;
      background-color: var(--primary, #f26a4f);
      color: white;
      border: none;
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(242, 106, 79, 0.25);
      transition: all 0.25s ease;
      font-family: inherit;
    }
    .btn:hover:not(:disabled) {
      background-color: var(--primary-hover, #e05538);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(242, 106, 79, 0.35);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }
    .error {
      color: #e74c3c;
      font-size: 0.85rem;
      font-weight: 550;
    }
    .muted {
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-muted, #7c7365);
    }
    .muted a {
      color: var(--primary, #f26a4f);
      text-decoration: none;
      font-weight: 600;
    }
    .muted a:hover {
      text-decoration: underline;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordsMatch }
  );

  submitting = false;
  token = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.errorMessage = 'Invalid, missing, or expired reset token.';
    }
  }

  get f() {
    return this.form.controls;
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('password')?.value;
    const cpw = control.get('confirmPassword')?.value;
    return pw && cpw && pw === cpw ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newPassword = String(this.form.value.password);

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Your password has been reset successfully! Redirecting you to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Failed to reset password. The link may have expired.';
      }
    });
  }
}
