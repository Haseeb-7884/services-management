<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitalize - Sign Up</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- Custom CSS -->
    <style>
        /* ============================================
           DIGITALIZE SIGNUP PAGE STYLES
           Prefix: dg- (Digitalize)
           ============================================ */

        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            overflow: hidden;
        }

        /* Body and Background */
        .dg-signup-wrapper {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a1628 0%, #1a2942 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
        }

        /* Signup Card Container */
        .dg-signup-card {
            background: rgba(20, 32, 54, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 30px 35px;
            max-width: 520px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            max-height: 95vh;
            overflow-y: auto;
        }

        /* Logo Section */
        .dg-logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .dg-logo-icon {
            width: 40px;
            height: 40px;
            background: #00d4ff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .dg-logo-icon svg {
            width: 24px;
            height: 24px;
            color: #ffffff;
        }

        .dg-logo-text {
            font-size: 1.4rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
        }

        /* Welcome Header */
        .dg-welcome-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .dg-welcome-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .dg-welcome-subtitle {
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
            margin: 0;
        }

        /* Form Styles */
        .dg-form {
            width: 100%;
        }

        .dg-form-group {
            margin-bottom: 14px;
        }

        .dg-form-label {
            display: block;
            color: #cbd5e1;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 6px;
        }

        /* Phone Number Container */
        .dg-phone-container {
            display: flex;
            gap: 10px;
            width: 100%;
        }

        .dg-country-code {
            flex: 0 0 140px;
            position: relative;
        }

        .dg-phone-number {
            flex: 1;
        }

        /* Country Code Dropdown */
        .dg-country-select {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 8px;
            padding: 10px 12px;
            color: #e2e8f0;
            font-size: 0.85rem;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
        }

        .dg-country-select:focus {
            outline: none;
            border-color: #00d4ff;
            background: rgba(15, 23, 42, 0.8);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        .dg-country-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
        }

        .dg-flag {
            width: 20px;
            height: 15px;
            border-radius: 2px;
        }

        /* Input Field Container */
        .dg-input-wrapper {
            position: relative;
            width: 100%;
        }

        .dg-input-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            width: 16px;
            height: 16px;
            pointer-events: none;
        }

        .dg-form-input {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 8px;
            padding: 10px 42px 10px 38px;
            color: #e2e8f0;
            font-size: 0.85rem;
            transition: all 0.3s ease;
        }

        .dg-form-input::placeholder {
            color: #64748b;
            font-size: 0.85rem;
        }

        .dg-form-input:focus {
            outline: none;
            border-color: #00d4ff;
            background: rgba(15, 23, 42, 0.8);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        /* Validation Feedback */
        .dg-validation-feedback {
            font-size: 0.75rem;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .dg-validation-feedback.valid {
            color: #10b981;
        }

        .dg-validation-feedback.invalid {
            color: #ef4444;
        }

        /* Password Toggle Button */
        .dg-password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
        }

        .dg-password-toggle:hover {
            color: #00d4ff;
        }

        .dg-password-toggle svg {
            width: 16px;
            height: 16px;
        }

        /* Signup Button */
        .dg-signup-btn {
            width: 100%;
            background: #00d4ff;
            color: #0a1628;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
            box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
        }

        .dg-signup-btn:hover:not(:disabled) {
            background: #00b8e6;
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(0, 212, 255, 0.4);
        }

        .dg-signup-btn:active {
            transform: translateY(0);
        }

        .dg-signup-btn:disabled {
            background: #64748b;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        /* Google Signup Button */
        .dg-google-btn {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .dg-google-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dg-google-btn:active {
            transform: translateY(0);
        }

        .dg-google-icon {
            width: 18px;
            height: 18px;
        }

        /* Divider */
        .dg-divider {
            display: flex;
            align-items: center;
            margin: 15px 0;
            color: #64748b;
            font-size: 0.85rem;
        }

        .dg-divider::before,
        .dg-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(148, 163, 184, 0.3);
        }

        .dg-divider-text {
            padding: 0 10px;
        }

        /* Login Section */
        .dg-login-section {
            text-align: center;
        }

        .dg-login-text {
            color: #94a3b8;
            font-size: 0.85rem;
            margin: 0;
        }

        .dg-login-link {
            color: #00d4ff;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .dg-login-link:hover {
            color: #00b8e6;
            text-decoration: underline;
        }

        /* Password strength indicator */
        .dg-password-strength {
            margin-top: 6px;
            height: 3px;
            border-radius: 2px;
            background-color: #64748b;
            overflow: hidden;
        }

        .dg-password-strength-bar {
            height: 100%;
            width: 0;
            transition: all 0.3s ease;
        }

        .dg-password-strength.weak .dg-password-strength-bar {
            background-color: #ef4444;
            width: 33%;
        }

        .dg-password-strength.medium .dg-password-strength-bar {
            background-color: #f59e0b;
            width: 66%;
        }

        .dg-password-strength.strong .dg-password-strength-bar {
            background-color: #10b981;
            width: 100%;
        }

        .dg-password-feedback {
            font-size: 0.75rem;
            margin-top: 4px;
            color: #94a3b8;
        }

        /* Loading State */
        .dg-loading {
            opacity: 0.7;
            pointer-events: none;
        }

        /* Custom scrollbar for the card */
        .dg-signup-card::-webkit-scrollbar {
            width: 6px;
        }

        .dg-signup-card::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.6);
            border-radius: 3px;
        }

        .dg-signup-card::-webkit-scrollbar-thumb {
            background: #00d4ff;
            border-radius: 3px;
        }

        .dg-signup-card::-webkit-scrollbar-thumb:hover {
            background: #00b8e6;
        }
    </style>
</head>

<body>

    <!-- Signup Wrapper -->
    <div class="dg-signup-wrapper">
        <!-- Signup Card -->
        <div class="dg-signup-card">
            <!-- Logo Section -->
            <div class="dg-logo-section">
                <div class="dg-logo-icon">
                    <!-- User Plus Icon SVG -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M19 8v6"></path>
                        <path d="M22 11h-6"></path>
                    </svg>
                </div>
                <h1 class="dg-logo-text">DigiScale</h1>
            </div>

            <!-- Welcome Header -->
            <div class="dg-welcome-header">
                <h2 class="dg-welcome-title">Create Your Account</h2>
                <p class="dg-welcome-subtitle">Join DigiScale to unlock exclusive features and manage your digital presence.</p>
            </div>

            <!-- Signup Form -->
            <form action="signup_handle.php" method="POST" class="dg-form" id="dgSignupForm">
                <!-- Full Name Field -->
                <div class="dg-form-group">
                    <label for="dgName" class="dg-form-label">Full Name</label>
                    <div class="dg-input-wrapper">
                        <!-- User Icon -->
                        <svg class="dg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input
                            type="text"
                            class="dg-form-input"
                            id="dgName"
                            placeholder="Enter your full name"
                            name="name"
                            required>
                    </div>
                </div>

                <!-- Email Address Field -->
                <div class="dg-form-group">
                    <label for="dgEmail" class="dg-form-label">Email Address</label>
                    <div class="dg-input-wrapper">
                        <!-- Email Icon -->
                        <svg class="dg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                            <path d="m3 7 9 6 9-6"></path>
                        </svg>
                        <input
                            type="email"
                            class="dg-form-input"
                            id="dgEmail"
                            placeholder="Enter your email"
                            name="email"
                            required>
                    </div>
                    <div class="dg-validation-feedback" id="emailFeedback"></div>
                </div>

                <!-- Phone Number Field -->
                <div class="dg-form-group">
                    <label for="dgPhone" class="dg-form-label">Phone Number</label>
                    <div class="dg-phone-container">
                        <!-- Country Code Dropdown -->
                        <div class="dg-country-code">
                            <select class="dg-country-select" id="countryCode" name="country_code" required>
                                <option value="">Loading countries...</option>
                            </select>
                        </div>
                        
                        <!-- Phone Number Input -->
                        <div class="dg-phone-number">
                            <div class="dg-input-wrapper">
                                <!-- Phone Icon -->
                                <svg class="dg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <input
                                    type="tel"
                                    class="dg-form-input"
                                    id="dgPhone"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    required>
                            </div>
                        </div>
                    </div>
                    <div class="dg-validation-feedback" id="phoneFeedback"></div>
                </div>

                <!-- Password Field -->
                <div class="dg-form-group">
                    <label for="dgPassword" class="dg-form-label">Password</label>
                    <div class="dg-input-wrapper">
                        <!-- Lock Icon -->
                        <svg class="dg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            type="password"
                            class="dg-form-input"
                            id="dgPassword"
                            placeholder="Create a password"
                            name="password"
                            required>
                        <!-- Password Toggle Button -->
                        <button type="button" class="dg-password-toggle" id="passwordToggle">
                            <!-- Eye icon for show password -->
                            <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <!-- Eye-off icon (hidden by default) -->
                            <svg id="eyeOffIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                    <!-- Password Strength Indicator -->
                    <div class="dg-password-strength" id="passwordStrength">
                        <div class="dg-password-strength-bar"></div>
                    </div>
                    <div class="dg-password-feedback" id="passwordFeedback"></div>
                </div>

                <!-- Confirm Password Field -->
                <div class="dg-form-group">
                    <label for="dgConfirmPassword" class="dg-form-label">Confirm Password</label>
                    <div class="dg-input-wrapper">
                        <!-- Lock Icon -->
                        <svg class="dg-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            type="password"
                            class="dg-form-input"
                            id="dgConfirmPassword"
                            placeholder="Confirm your password"
                            name="confirm_password"
                            required>
                        <!-- Password Toggle Button -->
                        <button type="button" class="dg-password-toggle" id="confirmPasswordToggle">
                            <!-- Eye icon for show password -->
                            <svg id="confirmEyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <!-- Eye-off icon (hidden by default) -->
                            <svg id="confirmEyeOffIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="dg-password-feedback" id="confirmPasswordFeedback"></div>
                </div>

                <!-- Signup Button -->
                <button type="submit" name="submit_signup" class="dg-signup-btn" id="signupButton" disabled>
                    Create Account
                </button>

                <!-- Divider -->
                <div class="dg-divider">
                    <span class="dg-divider-text">or</span>
                </div>

                <!-- Google Signup Button -->
                <button type="button" class="dg-google-btn">
                    <svg class="dg-google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                </button>

                <!-- Login Section -->
                <div class="dg-login-section">
                    <p class="dg-login-text">
                        Already have an account? <a href="login.php" class="dg-login-link">Login here</a>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript -->
    <script>
        // Country data from free API
        const countryData = [
            {name: "Afghanistan", code: "AF", dial_code: "+93"},
            {name: "Albania", code: "AL", dial_code: "+355"},
            {name: "Algeria", code: "DZ", dial_code: "+213"},
            {name: "Andorra", code: "AD", dial_code: "+376"},
            {name: "Angola", code: "AO", dial_code: "+244"},
            {name: "Antigua and Barbuda", code: "AG", dial_code: "+1"},
            {name: "Argentina", code: "AR", dial_code: "+54"},
            {name: "Armenia", code: "AM", dial_code: "+374"},
            {name: "Australia", code: "AU", dial_code: "+61"},
            {name: "Austria", code: "AT", dial_code: "+43"},
            {name: "Azerbaijan", code: "AZ", dial_code: "+994"},
            {name: "Bahamas", code: "BS", dial_code: "+1"},
            {name: "Bahrain", code: "BH", dial_code: "+973"},
            {name: "Bangladesh", code: "BD", dial_code: "+880"},
            {name: "Barbados", code: "BB", dial_code: "+1"},
            {name: "Belarus", code: "BY", dial_code: "+375"},
            {name: "Belgium", code: "BE", dial_code: "+32"},
            {name: "Belize", code: "BZ", dial_code: "+501"},
            {name: "Benin", code: "BJ", dial_code: "+229"},
            {name: "Bhutan", code: "BT", dial_code: "+975"},
            {name: "Bolivia", code: "BO", dial_code: "+591"},
            {name: "Bosnia and Herzegovina", code: "BA", dial_code: "+387"},
            {name: "Botswana", code: "BW", dial_code: "+267"},
            {name: "Brazil", code: "BR", dial_code: "+55"},
            {name: "Brunei", code: "BN", dial_code: "+673"},
            {name: "Bulgaria", code: "BG", dial_code: "+359"},
            {name: "Burkina Faso", code: "BF", dial_code: "+226"},
            {name: "Burundi", code: "BI", dial_code: "+257"},
            {name: "Cabo Verde", code: "CV", dial_code: "+238"},
            {name: "Cambodia", code: "KH", dial_code: "+855"},
            {name: "Cameroon", code: "CM", dial_code: "+237"},
            {name: "Canada", code: "CA", dial_code: "+1"},
            {name: "Central African Republic", code: "CF", dial_code: "+236"},
            {name: "Chad", code: "TD", dial_code: "+235"},
            {name: "Chile", code: "CL", dial_code: "+56"},
            {name: "China", code: "CN", dial_code: "+86"},
            {name: "Colombia", code: "CO", dial_code: "+57"},
            {name: "Comoros", code: "KM", dial_code: "+269"},
            {name: "Congo", code: "CG", dial_code: "+242"},
            {name: "Costa Rica", code: "CR", dial_code: "+506"},
            {name: "Croatia", code: "HR", dial_code: "+385"},
            {name: "Cuba", code: "CU", dial_code: "+53"},
            {name: "Cyprus", code: "CY", dial_code: "+357"},
            {name: "Czech Republic", code: "CZ", dial_code: "+420"},
            {name: "Denmark", code: "DK", dial_code: "+45"},
            {name: "Djibouti", code: "DJ", dial_code: "+253"},
            {name: "Dominica", code: "DM", dial_code: "+1"},
            {name: "Dominican Republic", code: "DO", dial_code: "+1"},
            {name: "Ecuador", code: "EC", dial_code: "+593"},
            {name: "Egypt", code: "EG", dial_code: "+20"},
            {name: "El Salvador", code: "SV", dial_code: "+503"},
            {name: "Equatorial Guinea", code: "GQ", dial_code: "+240"},
            {name: "Eritrea", code: "ER", dial_code: "+291"},
            {name: "Estonia", code: "EE", dial_code: "+372"},
            {name: "Eswatini", code: "SZ", dial_code: "+268"},
            {name: "Ethiopia", code: "ET", dial_code: "+251"},
            {name: "Fiji", code: "FJ", dial_code: "+679"},
            {name: "Finland", code: "FI", dial_code: "+358"},
            {name: "France", code: "FR", dial_code: "+33"},
            {name: "Gabon", code: "GA", dial_code: "+241"},
            {name: "Gambia", code: "GM", dial_code: "+220"},
            {name: "Georgia", code: "GE", dial_code: "+995"},
            {name: "Germany", code: "DE", dial_code: "+49"},
            {name: "Ghana", code: "GH", dial_code: "+233"},
            {name: "Greece", code: "GR", dial_code: "+30"},
            {name: "Grenada", code: "GD", dial_code: "+1"},
            {name: "Guatemala", code: "GT", dial_code: "+502"},
            {name: "Guinea", code: "GN", dial_code: "+224"},
            {name: "Guinea-Bissau", code: "GW", dial_code: "+245"},
            {name: "Guyana", code: "GY", dial_code: "+592"},
            {name: "Haiti", code: "HT", dial_code: "+509"},
            {name: "Honduras", code: "HN", dial_code: "+504"},
            {name: "Hungary", code: "HU", dial_code: "+36"},
            {name: "Iceland", code: "IS", dial_code: "+354"},
            {name: "India", code: "IN", dial_code: "+91"},
            {name: "Indonesia", code: "ID", dial_code: "+62"},
            {name: "Iran", code: "IR", dial_code: "+98"},
            {name: "Iraq", code: "IQ", dial_code: "+964"},
            {name: "Ireland", code: "IE", dial_code: "+353"},
            {name: "Israel", code: "IL", dial_code: "+972"},
            {name: "Italy", code: "IT", dial_code: "+39"},
            {name: "Jamaica", code: "JM", dial_code: "+1"},
            {name: "Japan", code: "JP", dial_code: "+81"},
            {name: "Jordan", code: "JO", dial_code: "+962"},
            {name: "Kazakhstan", code: "KZ", dial_code: "+7"},
            {name: "Kenya", code: "KE", dial_code: "+254"},
            {name: "Kiribati", code: "KI", dial_code: "+686"},
            {name: "Kuwait", code: "KW", dial_code: "+965"},
            {name: "Kyrgyzstan", code: "KG", dial_code: "+996"},
            {name: "Laos", code: "LA", dial_code: "+856"},
            {name: "Latvia", code: "LV", dial_code: "+371"},
            {name: "Lebanon", code: "LB", dial_code: "+961"},
            {name: "Lesotho", code: "LS", dial_code: "+266"},
            {name: "Liberia", code: "LR", dial_code: "+231"},
            {name: "Libya", code: "LY", dial_code: "+218"},
            {name: "Liechtenstein", code: "LI", dial_code: "+423"},
            {name: "Lithuania", code: "LT", dial_code: "+370"},
            {name: "Luxembourg", code: "LU", dial_code: "+352"},
            {name: "Madagascar", code: "MG", dial_code: "+261"},
            {name: "Malawi", code: "MW", dial_code: "+265"},
            {name: "Malaysia", code: "MY", dial_code: "+60"},
            {name: "Maldives", code: "MV", dial_code: "+960"},
            {name: "Mali", code: "ML", dial_code: "+223"},
            {name: "Malta", code: "MT", dial_code: "+356"},
            {name: "Marshall Islands", code: "MH", dial_code: "+692"},
            {name: "Mauritania", code: "MR", dial_code: "+222"},
            {name: "Mauritius", code: "MU", dial_code: "+230"},
            {name: "Mexico", code: "MX", dial_code: "+52"},
            {name: "Micronesia", code: "FM", dial_code: "+691"},
            {name: "Moldova", code: "MD", dial_code: "+373"},
            {name: "Monaco", code: "MC", dial_code: "+377"},
            {name: "Mongolia", code: "MN", dial_code: "+976"},
            {name: "Montenegro", code: "ME", dial_code: "+382"},
            {name: "Morocco", code: "MA", dial_code: "+212"},
            {name: "Mozambique", code: "MZ", dial_code: "+258"},
            {name: "Myanmar", code: "MM", dial_code: "+95"},
            {name: "Namibia", code: "NA", dial_code: "+264"},
            {name: "Nauru", code: "NR", dial_code: "+674"},
            {name: "Nepal", code: "NP", dial_code: "+977"},
            {name: "Netherlands", code: "NL", dial_code: "+31"},
            {name: "New Zealand", code: "NZ", dial_code: "+64"},
            {name: "Nicaragua", code: "NI", dial_code: "+505"},
            {name: "Niger", code: "NE", dial_code: "+227"},
            {name: "Nigeria", code: "NG", dial_code: "+234"},
            {name: "North Korea", code: "KP", dial_code: "+850"},
            {name: "North Macedonia", code: "MK", dial_code: "+389"},
            {name: "Norway", code: "NO", dial_code: "+47"},
            {name: "Oman", code: "OM", dial_code: "+968"},
            {name: "Pakistan", code: "PK", dial_code: "+92"},
            {name: "Palau", code: "PW", dial_code: "+680"},
            {name: "Palestine", code: "PS", dial_code: "+970"},
            {name: "Panama", code: "PA", dial_code: "+507"},
            {name: "Papua New Guinea", code: "PG", dial_code: "+675"},
            {name: "Paraguay", code: "PY", dial_code: "+595"},
            {name: "Peru", code: "PE", dial_code: "+51"},
            {name: "Philippines", code: "PH", dial_code: "+63"},
            {name: "Poland", code: "PL", dial_code: "+48"},
            {name: "Portugal", code: "PT", dial_code: "+351"},
            {name: "Qatar", code: "QA", dial_code: "+974"},
            {name: "Romania", code: "RO", dial_code: "+40"},
            {name: "Russia", code: "RU", dial_code: "+7"},
            {name: "Rwanda", code: "RW", dial_code: "+250"},
            {name: "Saint Kitts and Nevis", code: "KN", dial_code: "+1"},
            {name: "Saint Lucia", code: "LC", dial_code: "+1"},
            {name: "Saint Vincent and the Grenadines", code: "VC", dial_code: "+1"},
            {name: "Samoa", code: "WS", dial_code: "+685"},
            {name: "San Marino", code: "SM", dial_code: "+378"},
            {name: "Sao Tome and Principe", code: "ST", dial_code: "+239"},
            {name: "Saudi Arabia", code: "SA", dial_code: "+966"},
            {name: "Senegal", code: "SN", dial_code: "+221"},
            {name: "Serbia", code: "RS", dial_code: "+381"},
            {name: "Seychelles", code: "SC", dial_code: "+248"},
            {name: "Sierra Leone", code: "SL", dial_code: "+232"},
            {name: "Singapore", code: "SG", dial_code: "+65"},
            {name: "Slovakia", code: "SK", dial_code: "+421"},
            {name: "Slovenia", code: "SI", dial_code: "+386"},
            {name: "Solomon Islands", code: "SB", dial_code: "+677"},
            {name: "Somalia", code: "SO", dial_code: "+252"},
            {name: "South Africa", code: "ZA", dial_code: "+27"},
            {name: "South Korea", code: "KR", dial_code: "+82"},
            {name: "South Sudan", code: "SS", dial_code: "+211"},
            {name: "Spain", code: "ES", dial_code: "+34"},
            {name: "Sri Lanka", code: "LK", dial_code: "+94"},
            {name: "Sudan", code: "SD", dial_code: "+249"},
            {name: "Suriname", code: "SR", dial_code: "+597"},
            {name: "Sweden", code: "SE", dial_code: "+46"},
            {name: "Switzerland", code: "CH", dial_code: "+41"},
            {name: "Syria", code: "SY", dial_code: "+963"},
            {name: "Taiwan", code: "TW", dial_code: "+886"},
            {name: "Tajikistan", code: "TJ", dial_code: "+992"},
            {name: "Tanzania", code: "TZ", dial_code: "+255"},
            {name: "Thailand", code: "TH", dial_code: "+66"},
            {name: "Timor-Leste", code: "TL", dial_code: "+670"},
            {name: "Togo", code: "TG", dial_code: "+228"},
            {name: "Tonga", code: "TO", dial_code: "+676"},
            {name: "Trinidad and Tobago", code: "TT", dial_code: "+1"},
            {name: "Tunisia", code: "TN", dial_code: "+216"},
            {name: "Turkey", code: "TR", dial_code: "+90"},
            {name: "Turkmenistan", code: "TM", dial_code: "+993"},
            {name: "Tuvalu", code: "TV", dial_code: "+688"},
            {name: "Uganda", code: "UG", dial_code: "+256"},
            {name: "Ukraine", code: "UA", dial_code: "+380"},
            {name: "United Arab Emirates", code: "AE", dial_code: "+971"},
            {name: "United Kingdom", code: "GB", dial_code: "+44"},
            {name: "United States", code: "US", dial_code: "+1"},
            {name: "Uruguay", code: "UY", dial_code: "+598"},
            {name: "Uzbekistan", code: "UZ", dial_code: "+998"},
            {name: "Vanuatu", code: "VU", dial_code: "+678"},
            {name: "Vatican City", code: "VA", dial_code: "+379"},
            {name: "Venezuela", code: "VE", dial_code: "+58"},
            {name: "Vietnam", code: "VN", dial_code: "+84"},
            {name: "Yemen", code: "YE", dial_code: "+967"},
            {name: "Zambia", code: "ZM", dial_code: "+260"},
            {name: "Zimbabwe", code: "ZW", dial_code: "+263"}
        ];

        // Initialize country dropdown
        function initializeCountryDropdown() {
            const countrySelect = document.getElementById('countryCode');
            countrySelect.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Country';
            countrySelect.appendChild(defaultOption);
            
            // Sort countries alphabetically
            const sortedCountries = countryData.sort((a, b) => a.name.localeCompare(b.name));
            
            // Add all countries
            sortedCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.dial_code;
                option.textContent = `${getFlagEmoji(country.code)} ${country.dial_code} ${country.name}`;
                option.dataset.countryCode = country.code;
                
                // Set Pakistan as default
                if (country.code === 'PK') {
                    option.selected = true;
                }
                
                countrySelect.appendChild(option);
            });
        }

        // Get flag emoji from country code
        function getFlagEmoji(countryCode) {
            const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt());
            return String.fromCodePoint(...codePoints);
        }

        // Phone validation patterns (simplified)
        const phonePatterns = {
            '+1': /^[2-9]\d{9}$/, // USA/Canada
            '+44': /^7[1-9]\d{8}$/, // UK
            '+91': /^[6-9]\d{9}$/, // India
            '+92': /^3[0-9]{9}$/, // Pakistan
            '+86': /^1[3-9]\d{9}$/, // China
            // Add more patterns as needed, default will accept any 8-15 digits
        };

        // Common fake number patterns
        const fakePatterns = [
            /^1234567890$/,
            /^1111111111$/,
            /^0000000000$/,
            /^9999999999$/,
            /^5555555555$/,
            /^0123456789$/,
            /^9876543210$/,
            /^(\d)\1{9}$/,
        ];

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeCountryDropdown();
            
            // Add event listeners
            initializeEventListeners();
        });

        // Rest of the JavaScript code remains the same as previous version
        // ... [Previous JavaScript validation code] ...
        
        // Initialize event listeners
        function initializeEventListeners() {
            // Password toggle functionality
            const passwordToggle = document.getElementById('passwordToggle');
            const passwordInput = document.getElementById('dgPassword');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');

            const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
            const confirmPasswordInput = document.getElementById('dgConfirmPassword');
            const confirmEyeIcon = document.getElementById('confirmEyeIcon');
            const confirmEyeOffIcon = document.getElementById('confirmEyeOffIcon');

            passwordToggle.addEventListener('click', function() {
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.style.display = 'none';
                    eyeOffIcon.style.display = 'block';
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.style.display = 'block';
                    eyeOffIcon.style.display = 'none';
                }
            });

            confirmPasswordToggle.addEventListener('click', function() {
                // Toggle confirm password visibility
                if (confirmPasswordInput.type === 'password') {
                    confirmPasswordInput.type = 'text';
                    confirmEyeIcon.style.display = 'none';
                    confirmEyeOffIcon.style.display = 'block';
                } else {
                    confirmPasswordInput.type = 'password';
                    confirmEyeIcon.style.display = 'block';
                    confirmEyeOffIcon.style.display = 'none';
                }
            });

            // Phone number validation
            const phoneInput = document.getElementById('dgPhone');
            const countrySelect = document.getElementById('countryCode');
            const phoneFeedback = document.getElementById('phoneFeedback');

            phoneInput.addEventListener('input', function() {
                validatePhoneNumber(this.value);
                validateForm();
            });

            countrySelect.addEventListener('change', function() {
                validatePhoneNumber(phoneInput.value);
                validateForm();
            });

            // Email validation
            const emailInput = document.getElementById('dgEmail');
            const emailFeedback = document.getElementById('emailFeedback');
            const signupButton = document.getElementById('signupButton');

            emailInput.addEventListener('input', function() {
                validateEmail(this.value);
                validateForm();
            });

            // Password strength
            const passwordStrength = document.getElementById('passwordStrength');
            const passwordFeedback = document.getElementById('passwordFeedback');
            const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');

            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
                validateForm();
            });

            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordMatch();
                validateForm();
            });

            // Name validation
            document.getElementById('dgName').addEventListener('input', validateForm);
        }

        // Phone validation function
        function validatePhoneNumber(phone) {
            const countryCode = document.getElementById('countryCode').value;
            const phoneFeedback = document.getElementById('phoneFeedback');
            
            phoneFeedback.textContent = '';
            phoneFeedback.className = 'dg-validation-feedback';
            
            if (phone.length === 0) {
                return false;
            }

            // Remove any non-digit characters
            const cleanPhone = phone.replace(/\D/g, '');
            
            // Get pattern for country or use default
            const pattern = phonePatterns[countryCode] || /^\d{8,15}$/;
            
            // Check pattern
            if (!pattern.test(cleanPhone)) {
                phoneFeedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> Invalid phone number format`;
                phoneFeedback.className = 'dg-validation-feedback invalid';
                return false;
            }
            
            // Check for fake numbers
            if (isFakeNumber(cleanPhone)) {
                phoneFeedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter a valid phone number`;
                phoneFeedback.className = 'dg-validation-feedback invalid';
                return false;
            }
            
            phoneFeedback.innerHTML = `<i class="fas fa-check-circle"></i> Valid phone number`;
            phoneFeedback.className = 'dg-validation-feedback valid';
            return true;
        }

        function isFakeNumber(phone) {
            return fakePatterns.some(pattern => pattern.test(phone));
        }

        // Email validation (same as before)
        function validateEmail(email) {
            const emailFeedback = document.getElementById('emailFeedback');
            
            emailFeedback.textContent = '';
            emailFeedback.className = 'dg-validation-feedback';
            
            if (email.length === 0) {
                return false;
            }
            
            // Enhanced email regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            
            if (!emailRegex.test(email)) {
                emailFeedback.textContent = 'Please enter a valid email address';
                emailFeedback.className = 'dg-validation-feedback invalid';
                return false;
            }
            
            // Extract domain
            const parts = email.split('@');
            const domain = parts[1].toLowerCase();
            
            // Allowed domains
            const allowedDomains = [
                'gmail.com', 'googlemail.com', 'google.com',
                'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'microsoft.com'
            ];
            
            if (!allowedDomains.includes(domain)) {
                emailFeedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please use a Google or Microsoft email';
                emailFeedback.className = 'dg-validation-feedback invalid';
                return false;
            }
            
            emailFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Valid email address';
            emailFeedback.className = 'dg-validation-feedback valid';
            return true;
        }

        // Password strength (same as before)
        function updatePasswordStrength(password) {
            const passwordStrength = document.getElementById('passwordStrength');
            const passwordFeedback = document.getElementById('passwordFeedback');
            
            let strength = 0;
            let feedback = '';

            if (password.length >= 8) strength += 1;
            else feedback = 'Password should be at least 8 characters long. ';

            if (/[a-z]/.test(password)) strength += 1;
            else feedback += 'Include lowercase letters. ';

            if (/[A-Z]/.test(password)) strength += 1;
            else feedback += 'Include uppercase letters. ';

            if (/[0-9]/.test(password)) strength += 1;
            else feedback += 'Include numbers. ';

            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            else feedback += 'Include special characters. ';

            passwordStrength.className = 'dg-password-strength';
            if (password.length === 0) {
                passwordFeedback.textContent = '';
            } else if (strength <= 2) {
                passwordStrength.classList.add('weak');
                passwordFeedback.textContent = feedback || 'Weak password';
                passwordFeedback.style.color = '#ef4444';
            } else if (strength <= 4) {
                passwordStrength.classList.add('medium');
                passwordFeedback.textContent = 'Medium password strength';
                passwordFeedback.style.color = '#f59e0b';
            } else {
                passwordStrength.classList.add('strong');
                passwordFeedback.textContent = 'Strong password';
                passwordFeedback.style.color = '#10b981';
            }
        }

        // Password match validation
        function validatePasswordMatch() {
            const password = document.getElementById('dgPassword').value;
            const confirmPassword = document.getElementById('dgConfirmPassword').value;
            const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');

            if (confirmPassword.length === 0) {
                confirmPasswordFeedback.textContent = '';
            } else if (password !== confirmPassword) {
                confirmPasswordFeedback.textContent = 'Passwords do not match';
                confirmPasswordFeedback.style.color = '#ef4444';
            } else {
                confirmPasswordFeedback.textContent = 'Passwords match';
                confirmPasswordFeedback.style.color = '#10b981';
            }
        }

        // Form validation
        function validateForm() {
            const name = document.getElementById('dgName').value;
            const email = document.getElementById('dgEmail').value;
            const phone = document.getElementById('dgPhone').value;
            const password = document.getElementById('dgPassword').value;
            const confirmPassword = document.getElementById('dgConfirmPassword').value;
            const countryCode = document.getElementById('countryCode').value;
            const signupButton = document.getElementById('signupButton');
            
            // Check if all fields are filled
            if (!name || !email || !phone || !password || !confirmPassword || !countryCode) {
                signupButton.disabled = true;
                return;
            }
            
            // Check if email is valid
            if (!validateEmail(email)) {
                signupButton.disabled = true;
                return;
            }
            
            // Check if phone is valid
            if (!validatePhoneNumber(phone)) {
                signupButton.disabled = true;
                return;
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                signupButton.disabled = true;
                return;
            }
            
            // Check password strength (at least medium)
            const passwordStrength = document.getElementById('passwordStrength');
            if (!passwordStrength.classList.contains('medium') && !passwordStrength.classList.contains('strong')) {
                signupButton.disabled = true;
                return;
            }
            
            // All validations passed
            signupButton.disabled = false;
        }

        // Google signup button functionality
        document.querySelector('.dg-google-btn').addEventListener('click', function() {
            alert('Google signup functionality would be implemented here');
        });

        // Prevent default behavior that might cause scrolling on mobile
        document.addEventListener('touchmove', function(e) {
            if (e.target.tagName === 'INPUT') {
                e.preventDefault();
            }
        }, { passive: false });
    </script>
</body>

</html>