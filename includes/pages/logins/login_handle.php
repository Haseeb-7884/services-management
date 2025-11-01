<?php
include("../../connection.php");

// Debug: Check if form is submitted
error_log("Login form submitted: " . (isset($_POST['submit_login']) ? 'YES' : 'NO'));

$_SESSION['auth'] = false;
if (isset($_POST['submit_login'])) {
    $user_password = $_POST['password'];
    $user_email = $_POST['email'];
    $message = !empty($_POST['message']) ? $_POST['message'] : null;
    $packageID = !empty($_POST['packageID']) ? $_POST['packageID'] : null;
    $marketplaceID = !empty($_POST['marketplaceID']) ? $_POST['marketplaceID'] : null;
    $cartQuantity = !empty($_POST['cartQuantity']) ? $_POST['cartQuantity'] : null;

    error_log("Email: $user_email, Message: $message, PackageID: $packageID");

    $userLogin = new backend();
    $userLoginData = $userLogin->fetching('users', '*', null, "email = '$user_email'");

    if (!empty($userLoginData)) {
        $userEmail = $userLoginData[0]['email'];
        $userPassword = $userLoginData[0]['password'];

        if (!empty($user_email) && !empty($user_password)) {
            if ($user_email === $userEmail) {
                if (password_verify($user_password, $userPassword)) {
                    $_SESSION['auth'] = true;
                    $_SESSION['role'] = $userLoginData[0]['role'];
                    $_SESSION['login'] = $userLoginData[0]['email'];
                    $_SESSION['id'] = $userLoginData[0]['id'];

                    error_log("Login successful - Role: " . $_SESSION['role'] . ", Message: $message");
                    if ($_SESSION['role'] == 1) {
                        header("Location: ../../../admin/index.php");
                    } else {
                        if ($message === "cart_empty") {
                            header("Location: ../cart_handle.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
                        } else if ($message === "review_empty") {
                            echo "Redirecting to the review submit";
                        }else{
                            header("Location: ../../../index.php");
                            exit();
                        }

                        // var_dump($message);
                    }
                } else {
                    error_log("Password verification failed");
                    header("Location: login.php?error=UserPasswordInvalid&packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
                    exit();
                }
            } else {
                error_log("Email doesn't match");
                header("Location: login.php?error=EmailNotRegistered&packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
                exit();
            }
        } else {
            error_log("Empty email or password");
            header("Location: login.php?error=UserPasswordInvalid&packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
            exit();
        }
    } else {
        error_log("No user data found");
        if ($packageID == null && $marketplaceID == null) {
            header("Location: login.php?error=NotRegistered");
            exit();
        } else {
            header("Location: login.php?error=NotRegistered&packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
            exit();
        }
    }
} else {
    error_log("Form not submitted properly");
    header("Location: login.php?error=Connection&packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
    exit();
}
?>
