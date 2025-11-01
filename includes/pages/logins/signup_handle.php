<?php
include("../../connection.php");

if (isset($_POST['submit_signup'])) {
    // Get form data
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $country_code = $_POST['country_code'];
    $phone = trim($_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation functions
    function validateName($name) {
        // Name should contain only letters and spaces, 2-50 characters
        $namePattern = "/^[a-zA-Z\s]{2,50}$/";
        return preg_match($namePattern, $name);
    }

    function validateEmail($email) {
        // First check basic email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        
        // Extract domain
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return false;
        }
        
        $domain = strtolower($parts[1]);
        
        // Allowed domains
        $allowedDomains = [
            'gmail.com', 'googlemail.com', 'google.com',
            'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'microsoft.com'
        ];
        
        return in_array($domain, $allowedDomains);
    }

    function validatePhone($phone, $country_code) {
        // Remove any non-digit characters
        $cleanPhone = preg_replace('/\D/', '', $phone);
        
        // Basic length validation
        if (strlen($cleanPhone) < 8 || strlen($cleanPhone) > 15) {
            return false;
        }
        
        // Country-specific validation patterns
        $countryPatterns = [
            '+1' => '/^[2-9]\d{9}$/', // USA/Canada
            '+44' => '/^7[1-9]\d{8}$/', // UK
            '+91' => '/^[6-9]\d{9}$/', // India
            '+92' => '/^3[0-9]{9}$/', // Pakistan
            '+86' => '/^1[3-9]\d{9}$/', // China
            // Add more patterns as needed
        ];
        
        // Use specific pattern if available, otherwise use generic
        $pattern = $countryPatterns[$country_code] ?? '/^\d{8,15}$/';
        
        return preg_match($pattern, $cleanPhone);
    }

    function validatePassword($password) {
        // Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
        $passwordPattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/";
        return preg_match($passwordPattern, $password);
    }

    // Fake number patterns to block
    function isFakeNumber($phone) {
        $fakePatterns = [
            '/^1234567890$/',
            '/^1111111111$/',
            '/^0000000000$/',
            '/^9999999999$/',
            '/^5555555555$/',
            '/^0123456789$/',
            '/^9876543210$/',
            '/^(\d)\1{9}$/',
        ];
        
        foreach ($fakePatterns as $pattern) {
            if (preg_match($pattern, $phone)) {
                return true;
            }
        }
        return false;
    }

    // Validate all fields
    $errors = [];

    if (!validateName($name)) {
        $errors[] = "Invalid name format. Name should contain only letters and spaces (2-50 characters).";
    }

    if (!validateEmail($email)) {
        $errors[] = "Invalid email format. Please use a Google or Microsoft email address.";
    }

    // Clean phone for validation
    $cleanPhone = preg_replace('/\D/', '', $phone);
    
    if (!validatePhone($cleanPhone, $country_code)) {
        $errors[] = "Invalid phone number format for the selected country.";
    }

    if (isFakeNumber($cleanPhone)) {
        $errors[] = "Please enter a valid phone number.";
    }

    if (!validatePassword($password)) {
        $errors[] = "Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match.";
    }

    // If no validation errors, proceed with registration
    if (empty($errors)) {
        try {
            // Check if email already exists
            $backend = new backend();
            $existingUser = $backend->fetching('users', 'id', null, "email = '$email'");

            if (!is_null($existingUser) && count($existingUser) > 0) {
                // Email already exists
                echo "Mail Already Exists";
                exit();
            }

            // Hash the password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Combine country code and phone number
            $full_phone = $country_code . $cleanPhone;

            // Prepare data for insertion
            $userData = [
                'name' => $name,
                'email' => $email,
                'number' => $full_phone,
                'password' => $hashedPassword,
                'role' => 0 // Default role
            ];

            // Insert into database
            $insertResult = $backend->insertion('users', $userData);

            if ($insertResult) {
                // Registration successful
                echo "Registration successful";
            } else {
                // Database insertion failed
                echo "Database insertion failed";
            }

        } catch (Exception $e) {
            // Handle any exceptions
            echo "Server Error: " . $e->getMessage();
        }
    } else {
        // There are validation errors
        $errorString = implode("|", $errors);
        echo $errorString;
    }

} else {
    // Form not submitted properly
    echo "Form not submitted properly";
}
?>