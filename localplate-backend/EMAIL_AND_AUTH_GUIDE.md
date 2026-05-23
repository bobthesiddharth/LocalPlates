## LocalPlates Backend - Email & Authentication Guide

This guide explains how the email authentication system works in local development and how to test signup/login flows.

---

### 📧 Email Configuration (Local Development)

**Current Status**: Email is **DISABLED** in `application.properties` for local development.

The `MailService` has a graceful fallback mechanism:
- When SMTP is not configured, all emails are printed to the **console** instead of being sent
- This allows you to test OTP codes and password reset links without sending real emails
- All authentication flows continue to work normally

---

### 🔐 Testing Authentication Flows

#### 1. **Signup Flow**
```
1. Open frontend: http://localhost:4200/signup
2. Enter email and password
3. Click "Create account"
4. Look in the backend console for:
   ==========================================================================
   DEVELOPER NOTICE - OUTGOING MAIL DISPATCH
   To: your-email@example.com
   Subject: LocalPlates - Your Registration Verification Code
   Fallback Content: [OTP CODE IS: XXXXXX]
   ==========================================================================
5. Copy the OTP code (6 digits) from console
6. Enter it in the verification field on frontend
```

#### 2. **Login Flow (Two-Factor Authentication)**
```
1. Open frontend: http://localhost:4200/login
2. Enter verified email and password (from signup)
3. Look in the backend console for the login OTP:
   Fallback Content: [OTP CODE IS: XXXXXX]
4. Copy the 6-digit OTP
5. Enter it in the verification field to complete login
```

#### 3. **Forgot Password Flow**
```
1. Open frontend: http://localhost:4200/login
2. Click "Forgot password?" link
3. Enter email address
4. Look in the backend console for:
   Fallback Content: [PASSWORD RESET LINK IS: http://localhost:4200/reset-password?token=...]
5. Copy the reset link and open it in your browser
6. Set a new password
```

---

### 🧪 Quick Test Credentials

Once you signup and verify:
- **Email**: test@localplates.dev
- **Password**: TestPassword123

Then use the same email for login (OTP will appear in console).

---

### 📨 Enabling Real Email (Production / Testing)

If you want to actually send emails (e.g., to Gmail):

#### Step 1: Create a Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Generate a password (16 characters)
4. Copy the password

#### Step 2: Update `application.properties`
```properties
# Java Mail Sender Config
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

#### Step 3: Restart Backend
```bash
./mvnw spring-boot:run
```

Now emails will actually be sent to inboxes instead of printing to console.

---

### 🔍 Console Output Example

When testing locally, you'll see console output like this:

```
==========================================================================
DEVELOPER NOTICE - OUTGOING MAIL DISPATCH
To: siddharthnayak@gmail.com
Subject: LocalPlates - Your Registration Verification Code
Fallback Content: [OTP CODE IS: 456789]
==========================================================================
```

**Copy `456789` and use it in the frontend OTP verification step.**

---

### 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| No console output for OTP | Backend may be running in background. Check terminal logs. |
| "Authentication failed" error | SMTP config is active but credentials invalid. Disable SMTP in `application.properties`. |
| Email not arriving | Make sure SMTP is enabled and credentials are correct (use Gmail App Password, not regular password). |
| Need to test real emails but don't want to use Gmail | Use a free service like [Mailtrap](https://mailtrap.io) or [Mailhog](https://github.com/mailhog/MailHog) |

---

### 💡 Tips for Development

- **Keep email disabled** during development to avoid accidental emails
- **Monitor backend console** for OTP codes while testing signup/login
- **Use test email addresses** like `test@localplates.dev`, `dev@example.com`
- **Store OTP codes** in a notepad while testing multiple flows

---

### 📚 Related Files

- Backend email service: `src/main/java/com/localplates/LocalPlates/service/MailService.java`
- Authentication service: `src/main/java/com/localplates/LocalPlates/service/AuthService.java`
- Settings: `src/main/resources/application.properties`

---

### ✅ Current Setup Verified

- ✅ Signup OTP generation and fallback printing
- ✅ Login 2FA OTP generation and fallback printing  
- ✅ Password reset token generation and fallback printing
- ✅ Console output includes all necessary test codes
- ✅ No SMTP authentication errors in local dev mode

