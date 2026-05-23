# Email & Authentication Developer Guide

This guide helps you test and set up the LocalPlates authentication system during development.

---

## 📧 Email System Overview

The LocalPlates backend has a **smart email fallback system**:

### Development Mode (Default)
- **MAIL_ENABLED:** `false`
- **Behavior:** All emails are printed to the console instead of being sent
- **Use Case:** Perfect for local development without external SMTP setup
- **Output Location:** Backend console logs

### Production Mode
- **MAIL_ENABLED:** `true`
- **Behavior:** Emails sent via configured SMTP provider (Gmail)
- **Use Case:** Real sending to user inboxes
- **Requirement:** Valid SMTP credentials

---

## 🔐 Testing Authentication Flows

### Prerequisites
1. Backend running on `http://localhost:8080`
2. Frontend running on `http://localhost:4200`
3. Console output visible to watch for OTP codes

### Flow 1: User Signup

#### Step 1: Navigate to Signup
```
Open browser: http://localhost:4200/signup
```

#### Step 2: Enter Credentials
- **Email:** any-email@example.com
- **Password:** your-secure-password
- **Confirm Password:** your-secure-password (same)

#### Step 3: Submit Signup Form
- Click "Sign Up" button
- Frontend sends request to backend
- Backend generates OTP code

#### Step 4: Monitor Backend Console
Watch for output like this:
```
==========================================================================
DEVELOPER NOTICE - OUTGOING MAIL DISPATCH
To: any-email@example.com
Subject: LocalPlates Email Verification
Purpose: SIGNUP
Fallback Content: [OTP CODE IS: 456789]
==========================================================================
```

#### Step 5: Copy OTP Code
- Extract the 6-digit number (e.g., `456789`)
- Keep it ready for the next step

#### Step 6: Enter OTP in Frontend
- The frontend will show an OTP verification screen
- Paste the OTP code into the input field
- Click "Verify OTP"

#### Step 7: Complete Signup
- If OTP is correct, signup is complete
- User account created in H2 database
- You'll be redirected to login or dashboard

---

### Flow 2: User Login with 2FA

#### Step 1: Navigate to Login
```
Open browser: http://localhost:4200/login
```

#### Step 2: Enter Credentials
- **Email:** any-email@example.com (must be registered)
- **Password:** your-secure-password

#### Step 3: Submit Login Form
- Click "Log In" button
- Backend authenticates credentials
- Backend generates OTP for 2-factor authentication

#### Step 4: Monitor Backend Console
Look for similar output:
```
==========================================================================
DEVELOPER NOTICE - OUTGOING MAIL DISPATCH
To: any-email@example.com
Subject: LocalPlates 2FA Verification
Purpose: LOGIN
Fallback Content: [OTP CODE IS: 789456]
==========================================================================
```

#### Step 5: Enter 2FA OTP
- Copy the 6-digit OTP from console
- Frontend shows 2FA verification screen
- Enter the OTP code
- Click "Verify"

#### Step 6: Access Dashboard
- If OTP is correct, login is complete
- Redirected to dashboard
- Session token received and stored

---

### Flow 3: Forgot Password Reset

#### Step 1: Navigate to Password Reset
```
Open browser: http://localhost:4200/reset-password
```
OR click "Forgot Password?" link on login page

#### Step 2: Enter Email
- **Email:** any-email@example.com
- Click "Send Reset Link"

#### Step 3: Monitor Backend Console
Look for:
```
==========================================================================
DEVELOPER NOTICE - OUTGOING MAIL DISPATCH
To: any-email@example.com
Subject: LocalPlates Password Reset
Purpose: PASSWORD_RESET
Fallback Content: [RESET TOKEN: abc123def456ghi789jkl...]
==========================================================================
```

#### Step 4: Copy Reset Token
- Extract the full reset token
- This token is valid for a limited time

#### Step 5: Complete Password Reset
- Method 1: If frontend auto-handles token
  - Copy token from console
  - Paste in frontend form
- Method 2: If backend provides reset link
  - Extract token from console
  - Construct URL: `/reset-password?token=YOUR_TOKEN`
  - Open in browser

#### Step 6: Set New Password
- Enter new password
- Confirm new password
- Click "Reset Password"

#### Step 7: Login with New Password
- Navigate to login page
- Use new password
- Complete 2FA verification as usual

---

## 🌐 Google Sign-In Testing

### Prerequisites
1. Google OAuth client ID configured
2. Environment variable set: `export GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`
3. Backend restarted after setting env var
4. Frontend running

### Step 1: Check Google Button
- Navigate to `http://localhost:4200/login` or `/signup`
- If Google button is **visible**: OAuth is properly configured ✅
- If Google button is **hidden**: Check `GOOGLE_CLIENT_ID` env var

### Step 2: Click Google Sign-In Button
- Click "Sign in with Google"
- Google popup appears
- Sign in with your Google account

### Step 3: Backend Processing
- Frontend sends Google credential to backend
- Backend verifies with Google's tokeninfo endpoint
- Backend creates or retrieves local user account
- Backend returns session token

### Step 4: Access Dashboard
- Redirected to dashboard
- User signed in with Google account
- Same permissions as email-based login

---

## 🛠️ Troubleshooting

### Problem: No OTP Code in Console

**Symptoms:**
- Backend console shows no mail dispatch message
- OTP verification screen appears on frontend but you can't get code

**Solutions:**
1. Check `MAIL_ENABLED` in `application.properties`
   ```properties
   app.mail.enabled=${MAIL_ENABLED:false}
   ```
   Should default to `false` if not set

2. Verify Spring Mail is configured:
   ```properties
   spring.mail.host=${SMTP_HOST:smtp.gmail.com}
   spring.mail.port=${SMTP_PORT:587}
   ```

3. Check MailService.java has fallback logic:
   - If `mailSender` is null, should print to console
   - If not implemented, contact backend team

---

### Problem: Google Sign-In Button Not Visible

**Symptoms:**
- Login/signup pages render but no Google button
- Only email/password fields shown

**Solutions:**
1. Set `GOOGLE_CLIENT_ID` environment variable:
   ```bash
   export GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

2. Restart backend:
   ```bash
   # Kill existing process
   pkill -f spring-boot:run
   # Start new process
   ./mvnw spring-boot:run
   ```

3. Verify backend exposes client ID:
   - Endpoint: `GET /api/auth/google-config`
   - Should return: `{"clientId": "your-client-id..."}`

4. Check frontend requests correct endpoint:
   - Open browser DevTools → Network tab
   - Look for call to `/api/auth/google-config`
   - Should return 200 with clientId

---

### Problem: Frontend Can't Connect to Backend

**Symptoms:**
- Signup/login requests fail with network error
- Browser console shows CORS errors or connection refused

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:8080/api/auth/google-config
   ```
   Should return JSON (or error if not set up)

2. Check backend port:
   - Should be `8080`
   - Verify in `application.properties`:
     ```properties
     server.port=8080
     ```

3. Check frontend API configuration:
   - Look for API base URL configuration
   - Should point to `http://localhost:8080`
   - Check in environment files or service files

4. Verify CORS is enabled:
   - Backend should allow requests from `localhost:4200`
   - Check `@CrossOrigin` annotation on controllers
   - Check WebConfig or CorsConfig if exists

---

### Problem: OTP Code Keeps Expiring

**Symptoms:**
- OTP code displayed in console
- Entering code shows "OTP expired" or "OTP not valid"

**Solutions:**
1. Check OTP expiration time:
   - Default usually 10 minutes
   - Look in AuthService.java: `OTP_EXPIRY_MINUTES`

2. Generate fresh OTP:
   - Close current browser tab
   - Start signup/login flow again
   - New OTP generated with fresh timer

3. Verify backend time:
   - If server time is wrong, OTPs appear expired
   - Check: `date` command on backend machine
   - Ensure correct timezone

---

## 📐 OTP Codes Format

### Signup/Login OTP
```
[OTP CODE IS: 123456]
```
- 6-digit numeric code
- Valid for 10 minutes
- One-time use only

### Password Reset Token
```
[RESET TOKEN: abc123def456ghi789jkl...]
```
- Longer alphanumeric string
- Valid for 1 hour
- Can be used once to reset password

---

## 🗄️ Testing with H2 Database

### View Data in H2 Console

#### Access H2 Console
1. Backend running on `localhost:8080`
2. Open: `http://localhost:8080/h2-console`
3. Connection settings:
   - **JDBC URL:** `jdbc:h2:mem:localplates`
   - **User:** `sa`
   - **Password:** (leave blank)
4. Click "Connect"

#### Query User Data
```sql
-- View all registered users
SELECT * FROM users;

-- View specific user
SELECT * FROM users WHERE email = 'test@example.com';
```

#### Query OTP Codes
```sql
-- View all OTP codes
SELECT * FROM otp_codes;

-- View active OTPs (not used yet)
SELECT * FROM otp_codes WHERE is_used = FALSE;

-- View specific user's OTPs
SELECT * FROM otp_codes WHERE email = 'test@example.com';
```

#### Query Reset Tokens
```sql
-- View all password reset tokens
SELECT * FROM password_reset_tokens;

-- View unused reset tokens
SELECT * FROM password_reset_tokens WHERE is_used = FALSE;
```

---

## 🔄 Resetting Data for Fresh Testing

### Clear All User Data
```sql
DELETE FROM otp_codes;
DELETE FROM password_reset_tokens;
DELETE FROM users;
```

### Restart with Fresh Database
1. Stop backend: `Ctrl+C` in terminal
2. Start backend: `./mvnw spring-boot:run`
3. H2 database recreates automatically
4. All tables empty and ready for testing

---

## 📞 Common Commands

### Backend Operations
```bash
# Start backend
cd /Users/siddharthnayak/Desktop/LocalPlates/localplate-backend/localPlates-spring-app
./mvnw spring-boot:run

# Rebuild backend
./mvnw clean install

# Run tests
./mvnw test

# Clean build directory
./mvnw clean
```

### Frontend Operations
```bash
# Start frontend dev server
cd /Users/siddharthnayak/Desktop/LocalPlates/localplate-frontend/localplate-angular-app
npm start

# Build for production
npm run build

# Run tests
npm test

# Install dependencies
npm install
```

### Environment Variables
```bash
# Set email config (optional)
export MAIL_ENABLED=false
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password

# Set Google OAuth (optional)
export GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com

# Verify variables are set
echo $GOOGLE_CLIENT_ID
echo $MAIL_ENABLED
```

---

## ✅ Verification Checklist

- ✅ Backend compiles without errors
- ✅ Frontend builds successfully
- ✅ Backend starts on `localhost:8080`
- ✅ Frontend starts on `localhost:4200`
- ✅ H2 console accessible at `localhost:8080/h2-console`
- ✅ Can signup with email/password
- ✅ OTP codes appear in backend console
- ✅ Can verify OTP on frontend
- ✅ Can complete signup flow
- ✅ Can login with registered email
- ✅ 2FA OTP appears in console
- ✅ Can access dashboard after login
- ✅ Can request password reset
- ✅ Reset token appears in console
- ✅ Can reset password successfully
- ✅ Can login with new password
- ✅ (Optional) Google button visible if `GOOGLE_CLIENT_ID` set
- ✅ (Optional) Can sign in with Google

---

## 📚 Additional Resources

- **Spring Boot Mail Documentation:** https://docs.spring.io/spring-boot/docs/current/guide-html/mail.html
- **Angular Authentication:** Angular Documentation
- **Google OAuth Setup:** https://developers.google.com/identity/oauth2
- **H2 Database:** https://h2database.com/html/quickStart.html

---

**Last Updated:** May 24, 2026  
**Status:** Ready for Development Testing ✅

