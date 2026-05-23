# Google Sign-In Setup for LocalPlates

This project now supports signing in with a Google account.

## What it does
- Shows a Google sign-in button on the login and signup pages
- Sends the Google credential to the Spring Boot backend
- Verifies the Google token using Google's tokeninfo endpoint
- Creates or reuses a local user account
- Returns the same session token used by the app's existing auth flow

## Required configuration
You must set a Google OAuth **Web application client ID**.

### Backend environment variable
Set:
```bash
export GOOGLE_CLIENT_ID="your-google-oauth-web-client-id.apps.googleusercontent.com"
```

The backend exposes this value through:
- `GET /api/auth/google-config`

## Google Cloud Console setup
1. Open Google Cloud Console.
2. Create or select a project.
3. Enable **Google Identity Services / OAuth consent** as needed.
4. Create an **OAuth 2.0 Client ID**.
5. Choose **Web application**.
6. Add authorized JavaScript origins:
   - `http://localhost:4200`
7. Copy the client ID and set `GOOGLE_CLIENT_ID`.

## How it works in the app
- The frontend loads the Google Identity Services button dynamically.
- It asks the backend for the configured client ID.
- If Google sign-in is enabled, the button is rendered.
- After Google login, the app saves the returned token and redirects to the dashboard.

## Start the backend
```bash
cd /Users/siddharthnayak/Desktop/LocalPlates/localplate-backend/localPlates-spring-app
./mvnw spring-boot:run
```

## Start the frontend
```bash
cd /Users/siddharthnayak/Desktop/LocalPlates/localplate-frontend/localplate-angular-app
npm start
```

## Important notes
- The backend must be restarted after setting `GOOGLE_CLIENT_ID`.
- If `GOOGLE_CLIENT_ID` is missing, the Google button will not be available.
- Existing email/password and OTP login still work.

## API endpoints added
- `GET /api/auth/google-config`
- `POST /api/auth/google-login`

## Troubleshooting
- **Button not visible**: make sure `GOOGLE_CLIENT_ID` is set and the backend is restarted.
- **Login fails**: ensure the Google OAuth client ID matches the one in Google Cloud Console.
- **Wrong origin**: add `http://localhost:4200` to authorized origins.

