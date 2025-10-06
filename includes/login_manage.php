<?php
include("connection.php");
$_SESSION['auth'] = false;
if (isset($_POST['login_submit'])) {
    $user_email = $_POST['email'];
    $user_password = $_POST['password'];

    $userLogin = new backend();
    $userLoginData = $userLogin->fetching('users', '*', null, "email = '$user_email'");

    if (!empty($userLoginData)) {

        $userEmail = $userLoginData[0]['email'];
        $userPassword = $userLoginData[0]['password'];

        if (!empty($user_email) && !empty($user_password) && !empty($userPassword)) {

            if (password_verify($user_password, $userPassword)) {

                $_SESSION['auth'] = true;

                $_SESSION['role'] = $userLoginData[0]['role'];
                $_SESSION['login'] = $userLoginData[0]['email'];
                $_SESSION['id'] = $userLoginData[0]['id'];

                if($_SESSION['role'] == 1){ // editor role redirecting to the welcome screen of editor
                    header("location: ../website/pages/welcome.php");
                }else if($_SESSION['role'] == 2){ // admin role redirecting to the admin dashboard directly
                    header("location: ../admin/index.php");
                }else if ($_SESSION['role'] == 0){ // simple user role redirecting to the home page
                    header("location: ../website/pages/onboarding.php");
                }
            } else {
                echo "Wrong Password. Password not verifed correctly. Try Again";
            }
        } else {
            echo "Problem in Fetching Data. Try Again";
        }
    } else {
        echo "Please Fill the Form Correctly. Empty Form";
    }
} else {
    echo "Something went wrong. Problem in establishing Connection. Try Again";
}
