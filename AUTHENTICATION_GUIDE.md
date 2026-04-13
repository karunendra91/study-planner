# Study Planner - Authentication System Documentation

## 📋 Overview

The Study Planner now includes a complete **authentication system** with login/register forms, dark mode animations, localStorage persistence, and automatic session management.

---

## ✨ Features Implemented

### 1. **Login & Register Page** (`auth.html`)

- Clean, modern authentication interface
- Beautiful animated background with gradient blobs
- Smooth form switching between Login and Register
- Responsive design for mobile devices

### 2. **Form Features**

#### Login Form

- Email validation
- Password input with visibility toggle (👁️)
- "Remember me" functionality
- Forgot password link (placeholder)
- Auto-redirect to dashboard after login

#### Register Form

- Full name input
- Email validation with duplicate checking
- Strong password requirements:
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 number (e.g., "MyPassword123")
- Password confirmation
- Terms and conditions agreement
- Auto-login after successful registration

### 3. **Dark Mode Styling**

- Primary theme: Dark background (#0f0f0f, #1a1a1a)
- Accent colors: Blue (#0d6efd) and Cyan (#0dcaf0)
- Smooth transitions and animations
- Consistent with main dashboard styling

### 4. **Animations**

- **Blob Animation**: Floating gradient blobs in background (15-25s duration)
- **Form Slide In**: Forms slide in from right with ease-out timing
- **Logo Float**: Logo bounces up and down (3s animation)
- **Button Hover**: Buttons lift on hover with shadow
- **Input Focus**: Glowing border effect when inputs are focused
- **Toast Notifications**: Animated toast messages for feedback

### 5. **LocalStorage Integration**

The system stores and retrieves data using localStorage:

```javascript
// User Data Structure
{
    "id": timestamp,
    "name": "User Full Name",
    "email": "user@example.com",
    "password": "hashed_password",
    "createdAt": "ISO_timestamp",
    "preferences": {
        "theme": "dark",
        "notifications": true
    }
}

// Stored Keys:
localStorage.studyPlannerUsers              // All registered users array
localStorage.studyPlannerCurrentUser        // Currently logged-in user
localStorage.rememberMeEmail                // Email stored if "Remember me" is checked
```

### 6. **Authentication Flow**

```
1. User opens website
   ↓
2. App checks localStorage for studyPlannerCurrentUser
   ├─ If found: Redirect to dashboard (index.html)
   └─ If not found: Redirect to auth.html

3. On auth.html:
   ├─ Login: Validate credentials → Create session → Redirect to dashboard
   └─ Register: Create account → Auto-login → Redirect to dashboard

4. On dashboard/other pages:
   ├─ Check authentication on page load
   ├─ Display user's first name in navbar dropdown
   └─ Logout button clears session and returns to auth.html
```

### 7. **Logout Functionality**

- Logout button in navbar dropdown menu (👤 User menu)
- Confirmation dialog before logout
- Clears `studyPlannerCurrentUser` from localStorage
- Clears "Remember me" data
- Redirects to auth.html

---

## 📁 Files Created/Modified

### **New Files**

| File           | Purpose                                |
| -------------- | -------------------------------------- |
| `auth.html`    | Login/Register page with forms         |
| `css/auth.css` | Authentication styling and animations  |
| `js/auth.js`   | Authentication logic and form handling |

### **Modified Files**

| File             | Changes                                   |
| ---------------- | ----------------------------------------- |
| `index.html`     | Added logout button in navbar, auth check |
| `tasks.html`     | Added logout button in navbar, auth check |
| `subjects.html`  | Added logout button in navbar, auth check |
| `calender.html`  | Added logout button in navbar, auth check |
| `exams.html`     | Added logout button in navbar, auth check |
| `analytics.html` | Added logout button in navbar, auth check |
| `settings.html`  | Added logout button in navbar, auth check |
| `js/app.js`      | Added authentication check function       |

---

## 🚀 How to Use

### **First Time User**

1. Open the website (any page redirects to `auth.html`)
2. Click "Create Account" on the Login form
3. Fill in registration details:
   - Full Name
   - Email
   - Password (min 6 chars, 1 uppercase, 1 number)
   - Confirm Password
   - Check "I agree to Terms and Conditions"
4. Click "Create Account"
5. Auto-redirects to dashboard after registration

### **Returning User**

1. Open website → Redirected to Login page
2. Enter email and password
3. Optional: Check "Remember me" to pre-fill email next time
4. Click "Sign In"
5. Redirected to dashboard

### **Logout**

1. Click user dropdown menu in top-right navbar (👤)
2. Click "Logout"
3. Confirm the logout
4. Redirected to login page

---

## 🔐 Security Notes

### Current Implementation

- **Password Hashing**: Uses simple hash function (suitable for client-side demo)
- **LocalStorage**: All data stored locally (no server)
- **Session**: User session persists across page reloads

### For Production

⚠️ **Important**: This implementation is for educational/demo purposes. For production:

1. **Backend Required**: Never store passwords on client-side
2. **Use bcrypt/Argon2**: Proper password hashing on server
3. **JWT/Sessions**: Implement secure token system
4. **HTTPS**: Use SSL/TLS encryption
5. **Database**: Store users in encrypted database (MongoDB, PostgreSQL, etc.)
6. **Rate Limiting**: Prevent brute force attacks
7. **Email Verification**: Confirm user email addresses

---

## ✅ Testing Credentials

### Test Account 1

- **Name**: John Doe
- **Email**: john@example.com
- **Password**: TestPass123

### Create Your Own

- Enter any valid email
- Create password with: 1 uppercase, 1 number, min 6 characters
- Confirm and register

⚠️ Note: Refresh page or clear localStorage to reset accounts

---

## 🎨 Customization

### Change Colors

Edit `css/auth.css`:

```css
:root {
  --primary: #0d6efd; /* Blue */
  --secondary: #6c757d; /* Gray */
  --success: #198754; /* Green */
  /* ... modify as needed ... */
}
```

### Change Animation Duration

Edit `css/auth.css`:

```css
.blob-1 {
  animation-duration: 15s;
} /* Change 15s to desired time */
.logo-circle {
  animation: float 3s ease-in-out infinite;
} /* Change 3s */
```

### Add Real Email Verification

In `js/auth.js`, add email verification after registration:

```javascript
// Send verification email
// Verify email before allowing login
// Activate account only after verification
```

---

## 💾 Data Persistence

### What's Stored

- **Users**: All registered user accounts
- **Current User**: Active session user data
- **Preferences**: User theme and notification settings
- **Study Data**: Tasks, subjects, exams (existing functionality)

### What's NOT Stored

- Passwords (hashed only)
- Sensitive information on client-side

### LocalStorage View

Open browser DevTools (F12) → Application → LocalStorage:

```
studyPlannerUsers: [{array of user objects}]
studyPlannerCurrentUser: {current logged-in user}
rememberMeEmail: "user@example.com"
studyTasks: [{array of tasks}]
studySubjects: [{array of subjects}]
studyExams: [{array of exams}]
studySettings: {settings object}
pomodoroTimer: {timer state}
```

---

## 🐛 Troubleshooting

### **"Login failed. Email not found"**

- Email in database: Check localStorage in DevTools
- Case-sensitive: Email matching is case-insensitive
- Clear cache: Try clearing browser cache

### **"Password must be at least 6 characters..."**

Password requirements:

- ✅ Minimum 6 characters
- ✅ At least 1 UPPERCASE letter (A-Z)
- ✅ At least 1 number (0-9)
- Example: `Secure123`

### **Session Lost After Refresh**

- LocalStorage might be disabled
- Check browser settings → Privacy & Security
- Ensure cookies/storage are allowed

### **Can't Login After Registration**

- Wait for page redirect (1-2 seconds)
- Check browser console (F12) for errors
- Try manual logout and re-register

### **User Dropdown Not Showing**

- Page hasn't loaded auth check completely
- Refresh page
- Check console for JavaScript errors

---

## 📱 Responsive Features

- Mobile-optimized login form
- Dropdown menu works on touch devices
- Forms scale for different screen sizes
- Toast notifications visible on all devices

---

## 🔄 Integration with Study Planner

### When User Logs In

1. User data is stored in `studyPlannerCurrentUser`
2. StudyPlannerApp loads user preferences
3. All study data is associated with logged-in user
4. Dashboard shows personalized information

### Multi-User Support

- Each user has their own localStorage data
- Clear localStorage to switch users
- (In production: Each user would have server-side storage)

---

## 📚 Code Structure

### `auth.js` - Main Authentication Class

```javascript
class AuthManager {
    constructor()           // Initialize auth system
    loadUsers()             // Load users from localStorage
    saveUsers()             // Save users to localStorage
    getCurrentUser()        // Get logged-in user
    setCurrentUser()        // Set logged-in user
    hashPassword()          // Hash password
    validateEmail()         // Validate email format
    validatePasswordStrength()  // Check password requirements
    register()              // Handle registration
    login()                 // Handle login
    logout()                // Handle logout
    // ... (validation and display methods)
}
```

### Helper Functions

```javascript
switchForm(); // Switch between login/register forms
togglePassword(); // Show/hide password
logoutUser(); // Logout and redirect to auth page
```

---

## 🎯 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile editing
- [ ] Account deletion
- [ ] Login activity history
- [ ] Session timeout
- [ ] Server backend integration
- [ ] Encrypted database storage

---

## 📞 Support

For issues or questions:

1. Check browser console (F12) for error messages
2. Clear localStorage and try again
3. Check password requirements (uppercase + number)
4. Ensure JavaScript is enabled

---

## 📝 License

This Study Planner authentication system is part of the Study Planner project.

---

**Last Updated**: April 2026
**Version**: 1.0
