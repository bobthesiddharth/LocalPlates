package com.localplates.LocalPlates.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String code, String purpose) {
        String subject = "LocalPlates - Your " + purpose + " Verification Code";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;\">" +
                "<h2 style=\"color: #f26a4f;\">LocalPlates Authentication</h2>" +
                "<p>Hello,</p>" +
                "<p>Thank you for using LocalPlates. Your verification code for <strong>" + purpose + "</strong> is:</p>" +
                "<div style=\"background: #fbf9f6; padding: 15px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #2d2a26; border: 1px dashed #f26a4f; margin: 20px 0;\">" +
                code +
                "</div>" +
                "<p style=\"font-size: 12px; color: #7c7365;\">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>" +
                "</div>";

        sendHtmlEmail(toEmail, subject, htmlContent, "[OTP CODE IS: " + code + "]");
    }

    public void sendResetPasswordEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:4200/reset-password?token=" + token;
        String subject = "LocalPlates - Reset Your Password";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;\">" +
                "<h2 style=\"color: #f26a4f;\">LocalPlates Password Recovery</h2>" +
                "<p>Hello,</p>" +
                "<p>We received a request to reset your password. Click the link below to set a new password:</p>" +
                "<div style=\"text-align: center; margin: 24px 0;\">" +
                "<a href=\"" + resetUrl + "\" style=\"background-color: #f26a4f; color: white; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 100px; display: inline-block;\">Reset Password</a>" +
                "</div>" +
                "<p>Or copy and paste this link into your browser:</p>" +
                "<p><a href=\"" + resetUrl + "\">" + resetUrl + "</a></p>" +
                "<p style=\"font-size: 12px; color: #7c7365;\">This link will expire in 15 minutes. If you did not request a password reset, please secure your account immediately.</p>" +
                "</div>";

        sendHtmlEmail(toEmail, subject, htmlContent, "[PASSWORD RESET LINK IS: " + resetUrl + "]");
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent, String fallbackText) {
        System.out.println("==========================================================================");
        System.out.println("DEVELOPER NOTICE - OUTGOING MAIL DISPATCH");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Fallback Content: " + fallbackText);
        System.out.println("==========================================================================");

        if (mailSender == null) {
            System.err.println("MailSender not configured or unavailable. Proceeding via fallback printing.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + " due to exception: " + e.getMessage());
            System.err.println("This is expected if SMTP properties in application.properties are not configured with active credentials.");
            System.err.println("Development Flow: Please copy the fallback code printed above for testing.");
        }
    }
}
