package com.localplates.LocalPlates.service;

import com.localplates.LocalPlates.model.User;
import com.localplates.LocalPlates.model.OtpCode;
import com.localplates.LocalPlates.model.PasswordResetToken;
import com.localplates.LocalPlates.repository.UserRepository;
import com.localplates.LocalPlates.repository.OtpCodeRepository;
import com.localplates.LocalPlates.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpCodeRepository otpCodeRepository;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Autowired
    private MailService mailService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();
    private final RestTemplate restTemplate = new RestTemplate();

    public void signup(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(email, passwordHash);
        userRepository.save(user);

        // Generate and send registration OTP
        String code = generateNumericOtp();
        OtpCode otp = new OtpCode(email, code, LocalDateTime.now().plusMinutes(5), "SIGNUP");
        otpCodeRepository.save(otp);

        mailService.sendOtpEmail(email, code, "Registration");
    }

    public String getGoogleClientId() {
        return googleClientId == null ? "" : googleClientId.trim();
    }

    public boolean isGoogleLoginEnabled() {
        return !getGoogleClientId().isBlank();
    }

    public String googleLogin(String credential) {
        if (!isGoogleLoginEnabled()) {
            throw new IllegalStateException("Google sign-in is not configured on the backend yet.");
        }

        if (credential == null || credential.isBlank()) {
            throw new IllegalArgumentException("Missing Google credential.");
        }

        try {
            String encodedCredential = UriUtils.encodeQueryParam(credential, StandardCharsets.UTF_8);
            @SuppressWarnings("unchecked")
            Map<String, Object> tokenInfo = restTemplate.getForObject(
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodedCredential,
                    Map.class
            );

            if (tokenInfo == null || tokenInfo.isEmpty()) {
                throw new IllegalArgumentException("Unable to verify Google sign-in.");
            }

            String audience = String.valueOf(tokenInfo.get("aud"));
            if (!getGoogleClientId().equals(audience)) {
                throw new IllegalArgumentException("Google token audience does not match the configured client id.");
            }

            String email = String.valueOf(tokenInfo.get("email"));
            String emailVerified = String.valueOf(tokenInfo.get("email_verified"));

            if (email == null || email.isBlank() || "null".equalsIgnoreCase(email)) {
                throw new IllegalArgumentException("Google account email is missing.");
            }

            if (!"true".equalsIgnoreCase(emailVerified)) {
                throw new IllegalArgumentException("Google account email is not verified.");
            }

            User user = userRepository.findByEmail(email).orElseGet(() ->
                    new User(email, passwordEncoder.encode(UUID.randomUUID().toString())));
            user.setVerified(true);
            userRepository.save(user);

            return UUID.randomUUID().toString();
        } catch (RestClientException e) {
            throw new IllegalArgumentException("Google sign-in token could not be verified. Please try again.", e);
        }
    }

    public boolean verifySignup(String email, String code) {
        Optional<OtpCode> otpOpt = otpCodeRepository
                .findTopByEmailAndCodeAndPurposeAndUsedOrderByExpiresAtDesc(email, code, "SIGNUP", false);

        if (otpOpt.isEmpty()) {
            return false;
        }

        OtpCode otp = otpOpt.get();
        if (otp.isExpired()) {
            return false;
        }

        // Mark OTP as used
        otp.setUsed(true);
        otpCodeRepository.save(otp);

        // Verify the user
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setVerified(true);
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public boolean authenticateCredentials(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        User user = userOpt.get();
        if (!user.isVerified()) {
            throw new IllegalStateException("Your account is not verified. Please register again or verify your OTP first.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Credentials are valid, send Login OTP for Two-Factor auth
        String code = generateNumericOtp();
        OtpCode otp = new OtpCode(email, code, LocalDateTime.now().plusMinutes(5), "LOGIN");
        otpCodeRepository.save(otp);

        mailService.sendOtpEmail(email, code, "Login Verification");
        return true;
    }

    public String verifyLoginOtp(String email, String code) {
        Optional<OtpCode> otpOpt = otpCodeRepository
                .findTopByEmailAndCodeAndPurposeAndUsedOrderByExpiresAtDesc(email, code, "LOGIN", false);

        if (otpOpt.isEmpty() || otpOpt.get().isExpired()) {
            throw new IllegalArgumentException("Invalid or expired OTP code.");
        }

        OtpCode otp = otpOpt.get();
        otp.setUsed(true);
        otpCodeRepository.save(otp);

        // Generate a secure mock JWT/session token
        return UUID.randomUUID().toString();
    }

    public void initiateForgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Avoid email harvesting: log silently and pretend it went through
            System.out.println("Forgot password requested for non-existent email: " + email);
            return;
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, email, LocalDateTime.now().plusMinutes(15));
        resetTokenRepository.save(resetToken);

        mailService.sendResetPasswordEmail(email, token);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByTokenAndUsed(token, false);
        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();
        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }

        return false;
    }

    private String generateNumericOtp() {
        int number = secureRandom.nextInt(900000) + 100000; // Generates code in range 100000 - 999999
        return String.valueOf(number);
    }
}
