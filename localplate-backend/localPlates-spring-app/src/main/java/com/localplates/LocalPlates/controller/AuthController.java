package com.localplates.LocalPlates.controller;

import com.localplates.LocalPlates.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/google-config")
    public ResponseEntity<?> googleConfig() {
        return ResponseEntity.ok(Map.of(
                "clientId", authService.getGoogleClientId(),
                "enabled", authService.isGoogleLoginEnabled()
        ));
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest req) {
        try {
            String token = authService.googleLogin(req.getCredential());
            return ResponseEntity.ok(Map.of("token", token, "message", "Google login successful."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        try {
            authService.signup(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(Map.of("message", "Registration successful. OTP sent to email."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-signup")
    public ResponseEntity<?> verifySignup(@RequestBody VerifyRequest req) {
        boolean success = authService.verifySignup(req.getEmail(), req.getCode());
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired verification code."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authService.authenticateCredentials(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(Map.of("status", "2FA_REQUIRED", "message", "Verification code sent to email."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage(), "status", "UNVERIFIED"));
        }
    }

    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(@RequestBody VerifyRequest req) {
        try {
            String token = authService.verifyLoginOtp(req.getEmail(), req.getCode());
            return ResponseEntity.ok(Map.of("token", token, "message", "Login successful."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        authService.initiateForgotPassword(req.getEmail());
        return ResponseEntity.ok(Map.of("message", "If the email exists, a password reset link has been dispatched."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        boolean success = authService.resetPassword(req.getToken(), req.getNewPassword());
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please login with your new credentials."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token."));
        }
    }

    // Static request DTOs
    public static class SignupRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class VerifyRequest {
        private String email;
        private String code;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class ForgotPasswordRequest {
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class GoogleLoginRequest {
        private String credential;

        public String getCredential() { return credential; }
        public void setCredential(String credential) { this.credential = credential; }
    }
}
