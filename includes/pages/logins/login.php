<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitalize - Login</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- Custom CSS -->
    <style>
        /* ============================================
           DIGITALIZE LOGIN PAGE STYLES
           Prefix: dg- (Digitalize)
           ============================================ */

        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Body and Background */
        .dg-login-wrapper {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a1628 0%, #1a2942 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Login Card Container */
        .dg-login-card {
            background: rgba(20, 32, 54, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 36px 40px;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        }

        /* Logo Section */
        .dg-logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 24px;
        }

        .dg-logo-icon {
            width: 44px;
            height: 44px;
            background: #00d4ff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .dg-logo-icon svg {
            width: 26px;
            height: 26px;
            color: #ffffff;
        }

        .dg-logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
        }

        /* Welcome Header */
        .dg-welcome-header {
            text-align: center;
            margin-bottom: 28px;
        }

        .dg-welcome-title {
            font-size: 1.625rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
            line-height: 1.3;
        }

        .dg-welcome-subtitle {
            /* font-size: 0.875rem; */
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.6;
            margin: 0;
        }

        /* Form Styles */
        .dg-form {
            width: 100%;
        }

        .dg-form-group {
            margin-bottom: 18px;
        }

        .dg-form-label {
            display: block;
            color: #cbd5e1;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 8px;
        }

        /* Input Field Container */
        .dg-input-wrapper {
            position: relative;
            width: 100%;
        }

        .dg-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            width: 18px;
            height: 18px;
            pointer-events: none;
        }

        .dg-form-input {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 10px;
            padding: 11px 46px 11px 42px;
            color: #e2e8f0;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }

        .dg-form-input::placeholder {
            color: #64748b;
            font-size: 0.875rem;
        }

        .dg-form-input:focus {
            outline: none;
            border-color: #00d4ff;
            background: rgba(15, 23, 42, 0.8);
            box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        /* Password Toggle Button */
        .dg-password-toggle {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
        }

        .dg-password-toggle:hover {
            color: #00d4ff;
        }

        .dg-password-toggle svg {
            width: 18px;
            height: 18px;
        }

        /* Forgot Password Link */
        .dg-forgot-link-wrapper {
            text-align: right;
            margin-top: -6px;
            margin-bottom: 20px;
        }

        .dg-forgot-link {
            color: #00d4ff;
            font-size: 0.8125rem;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .dg-forgot-link:hover {
            color: #00b8e6;
            text-decoration: underline;
        }

        /* Login Button */
        .dg-login-btn {
            width: 100%;
            background: #00d4ff;
            color: #0a1628;
            border: none;
            border-radius: 10px;
            padding: 13px 16px;
            font-size: 0.9375rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
        }

        .dg-login-btn:hover {
            background: #00b8e6;
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(0, 212, 255, 0.4);
        }

        .dg-login-btn:active {
            transform: translateY(0);
        }

        /* Sign Up Section */
        .dg-signup-section {
            text-align: center;
        }

        .dg-signup-text {
            color: #94a3b8;
            font-size: 0.875rem;
            margin: 0;
        }

        .dg-signup-link {
            color: #00d4ff;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .dg-signup-link:hover {
            color: #00b8e6;
            text-decoration: underline;
        }

        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 350px;
        }

        .toast {
            min-width: 350px;
            max-width: 500px;
            width: auto;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            margin-bottom: 10px;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .btn-close {
            opacity: 0.8;
            transition: all 0.2s ease;
        }

        .btn-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        /* Animation for toast entry */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }

            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast.show {
            animation: slideInRight 0.3s ease-out;
        }

        /* Ensure toast body text wraps properly */
        .toast-body {
            flex-wrap: wrap;
        }

        .demo-content {
            max-width: 800px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
        }

        /* ============================================
           RESPONSIVE STYLES
           ============================================ */

        /* Large Desktops (1400px and above) */
        @media (min-width: 1400px) {
            .dg-login-card {
                max-width: 460px;
                padding: 40px 44px;
            }
        }

        /* Standard Laptops (1024px to 1399px) */
        @media (min-width: 1024px) and (max-width: 1399px) {
            .dg-login-wrapper {
                padding: 50px 20px;
            }

            .dg-login-card {
                max-width: 420px;
                padding: 34px 38px;
            }
        }

        /* Small Laptops (768px to 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
            .dg-login-wrapper {
                padding: 40px 20px;
            }

            .dg-login-card {
                max-width: 400px;
                padding: 32px 36px;
            }

            .dg-welcome-title {
                font-size: 1.5rem;
            }
        }

        /* Tablet Devices (576px to 767px) */
        @media (max-width: 767px) {
            .dg-login-wrapper {
                padding: 30px 20px;
            }

            .dg-login-card {
                padding: 32px 28px;
                max-width: 400px;
            }

            .dg-welcome-title {
                font-size: 1.5rem;
            }

            .dg-logo-icon {
                width: 40px;
                height: 40px;
            }

            .dg-logo-icon svg {
                width: 24px;
                height: 24px;
            }

            .dg-logo-text {
                font-size: 1.375rem;
            }
        }

        /* Mobile Devices (576px and below) */
        @media (max-width: 576px) {
            .dg-login-wrapper {
                padding: 25px 15px;
            }

            .dg-login-card {
                padding: 28px 24px;
                border-radius: 16px;
            }

            .dg-logo-section {
                margin-bottom: 22px;
            }

            .dg-logo-icon {
                width: 38px;
                height: 38px;
            }

            .dg-logo-icon svg {
                width: 22px;
                height: 22px;
            }

            .dg-logo-text {
                font-size: 1.25rem;
            }

            .dg-welcome-header {
                margin-bottom: 24px;
            }

            .dg-welcome-title {
                font-size: 1.375rem;
            }

            .dg-welcome-subtitle {
                font-size: 0.8125rem;
            }

            .dg-form-input {
                padding: 10px 44px 10px 40px;
            }

            .dg-login-btn {
                padding: 12px 16px;
                font-size: 0.875rem;
            }

            .dg-form-group {
                margin-bottom: 16px;
            }
        }

        /* Small Mobile Devices (400px and below) */
        @media (max-width: 400px) {
            .dg-login-card {
                padding: 24px 20px;
            }

            .dg-welcome-title {
                font-size: 1.25rem;
            }

            .dg-welcome-subtitle {
                font-size: 0.8125rem;
            }
        }

        /* Unique Toast Styles */
        .gec-toast-wrapper {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            min-width: 350px;
        }

        .gec-toast-box {
            min-width: 350px;
            max-width: 500px;
            width: auto;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            margin-bottom: 10px;
            overflow: hidden;
        }

        .gec-toast-box.gec-show {
            opacity: 1;
            transform: translateX(0);
            animation: gec-slide-in 0.3s ease-out;
        }

        @keyframes gec-slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }

            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .gec-close-btn {
            opacity: 0.8;
            transition: all 0.2s ease;
        }

        .gec-close-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .gec-toast-text {
            flex-wrap: wrap;
            padding: 14px 18px;

        }

        .gec-toast-text i {
            margin-right: 12px;
        }

        .gec-toast-text .fw-bold {
            font-size: 1rem;
        }

        .gec-toast-text .small {
            opacity: 0.9;
        }

        .gec-demo-section {
            max-width: 800px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
        }
    </style>
</head>

<body>

    <div class="gec-toast-wrapper" id="gecToastWrapper">
        <div
            class="gec-toast-box align-items-center text-bg-danger border-0 gec-show"
            id="gecErrorToast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="gec-toast-text d-flex align-items-center flex-grow-1">
                    <i class="fas fa-exclamation-triangle fs-4"></i>
                    <div class="flex-grow-1">
                        <div class="fw-bold">Authentication Required</div>
                        <div class="small text-light opacity-75" style="font-size:13px;">Please sign in to submit your review</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
    if (isset($_GET['error'])) {
        $error = $_GET['error'];
        if ($error == "Connection") {
    ?>
            <div class="toast-container" id="toastContainer">
                <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center flex-grow-1">
                            <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                            <div class="flex-grow-1">
                                <div class="fw-bold">Connection Error</div>
                                <div class="small">Error in establishing connection. Please try again.</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        <?php
        } else if ($error == "NotRegistered") {
        ?>
            <div class="toast-container" id="toastContainer">
                <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center flex-grow-1">
                            <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                            <div class="flex-grow-1">
                                <div class="fw-bold">User Not Registered</div>
                                <div class="small">Please register and login to continue.</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        <?php
        } elseif ($error == "UserPasswordInvalid") {
        ?>
            <div class="toast-container" id="toastContainer">
                <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center flex-grow-1">
                            <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                            <div class="flex-grow-1">
                                <div class="fw-bold">Password Verification Failed</div>
                                <div class="small">Please check your password and try again.</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        <?php
        } else if ($error == "EmailNotRegistered") {
        ?>
            <div class="toast-container" id="toastContainer">
                <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center flex-grow-1">
                            <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                            <div class="flex-grow-1">
                                <div class="fw-bold">Email Not Registered</div>
                                <div class="small">Kindly enter an authentic email to procede</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        <?php
        } else if ($error == "UserPasswordInvalid") {
        ?>
            <div class="toast-container" id="toastContainer">
                <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center flex-grow-1">
                            <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                            <div class="flex-grow-1">
                                <div class="fw-bold">Password Verification Failed</div>
                                <div class="small">Please check your password and try again.</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
    <?php
        }
    } else {
        echo null;
    }
    ?>

    <!-- Login Wrapper -->
    <div class="dg-login-wrapper">
        <!-- Login Card -->
        <div class="dg-login-card">
            <!-- Logo Section -->
            <div class="dg-logo-section">
                <div class="dg-logo-icon">
                    <!-- User Icon SVG -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h1 class="dg-logo-text">DigiScale</h1>
            </div>
            <?php
            if (isset($_GET['message']) || isset($_GET['marketplaceID'])) {
                $message = !empty($_GET['message']) ? $_GET['message'] : null;
                $marketplaceID = !empty($_GET['marketplaceID']) ? $_GET['marketplaceID'] : null;
                $packageID = !empty($_GET['packageID']) ? $_GET['packageID'] : null;
                $cartQuantity = !empty($_GET['cartQuantity']) ? $_GET['cartQuantity'] : null;
                if ($message == "cart_empty" && !empty($message)) {
            ?>
                    <div class="dg-welcome-header">
                        <h2 class="dg-welcome-title">Oops! Login First</h2>
                        <p class="dg-welcome-subtitle">It seems your account doesn't exist in our system. Please log in or create an account to proceed with checkout.</p>
                    </div>
                <?php
                } // if ends here
                elseif ($message == "review_empty" && !empty($message)) {
                ?>
                    <div class="dg-welcome-header">
                        <h2 class="dg-welcome-title">Oops! Login Required</h2>
                        <p class="dg-welcome-subtitle">It seems you're not registered with our system. Please log in or create an account to submit your review.</p>
                    </div>
                <?php
                } elseif ($message == null) {
                ?>
                    <div class="dg-welcome-header">
                        <h2 class="dg-welcome-title">Login To Proceed</h2>
                        <p class="dg-welcome-subtitle">Access your account to manage your activity and stay connected.</p>
                    </div>
                <?php
                }
            } else {
                ?>
                <div class="dg-welcome-header">
                    <h2 class="dg-welcome-title">Login To Proceed</h2>
                    <p class="dg-welcome-subtitle">Access your account to manage your activity and stay connected.</p>
                </div>
                <?php
                $message = null;
                echo "<input type='hidden' name='message' value='$message'>";
                $packageID = null;
                echo "<input type='hidden' name='packageID' value='$packageID'>";
                $marketplaceID = null;
                echo "<input type='hidden' name='marketplaceID' value='$marketplaceID'>";
                $cartQuantity = null;
                echo "<input type='hidden' name='cartQuantity' value='$cartQuantity'>";
                ?>
            <?php
            }
            ?>
            <!-- Welcome Header -->

            <!-- Login Form -->
            <form action="login_handle.php" method="POST" class="dg-form" id="dgLoginForm">
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
                </div>


                <input type="hidden" name="message" value="<?= $message ?>">
                <input type="hidden" name="packageID" value="<?= $packageID ?>">
                <input type="hidden" name="marketplaceID" value="<?= $marketplaceID ?>">
                <input type="hidden" name="cartQuantity" value="<?= $cartQuantity ?>">

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
                            placeholder="Enter your password"
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
                </div>

                <!-- Forgot Password Link -->
                <div class="dg-forgot-link-wrapper">
                    <a href="#" class="dg-forgot-link">Forgot password?</a>
                </div>

                <!-- Login Button -->
                <input type="submit" name="submit_login" class="dg-login-btn" value="Login Now">

                <!-- Sign Up Section -->
                <div class="dg-signup-section">
                    <p class="dg-signup-text">
                        Don't have an account? <a href="#" class="dg-signup-link">Create one</a>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript -->
    <script>
        // Password toggle functionality
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('dgPassword');
        const eyeIcon = document.getElementById('eyeIcon');
        const eyeOffIcon = document.getElementById('eyeOffIcon');

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

        document.addEventListener('DOMContentLoaded', function() {
            const toastElement = document.getElementById('errorToast');
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 5000
            });

            // Show the toast
            toast.show();

            // Remove the toast from DOM after it's hidden
            toastElement.addEventListener('hidden.bs.toast', function() {
                this.remove();
            });
        });

        // Unique JS for toast behavior
        document.addEventListener("DOMContentLoaded", function() {
            const gecToastEl = document.getElementById("gecErrorToast");
            const gecToast = new bootstrap.Toast(gecToastEl, {
                autohide: true,
                delay: 2000,
            });

            gecToast.show();

            // Remove from DOM after hidden
            gecToastEl.addEventListener("hidden.bs.toast", function() {
                this.remove();
            });
        });
        
    </script>
</body>

</html>