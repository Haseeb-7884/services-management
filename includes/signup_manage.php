<?php
include("connection.php");
if (isset($_POST['signup_submit'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    function Emailvalidate($Email)
    {
        $emailPattern = "/^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/";
        return  preg_match($emailPattern, $Email);
    }

    function Passwordvalidate($Password)
    {
        $passwordPattern = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/";
        return  preg_match($passwordPattern, $Password);
    }

    if (Emailvalidate($email)) {
        if (Passwordvalidate($password)) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $user_register = new backend;
            $user_exists = $user_register->fetching('users', 'id', null, "email = '$email'");
            if (!is_null($user_exists) && count($user_exists) > 0) {
                echo "User already exists";
            } else {
                $user_register->insertion('users', 
                array('email' => $email, 
                'password' => $hashedPassword,
                'Date'=>date('Y-m-d H:i:s')
            ));
                header("location: ../website/modules/login/login.php");
            }
        }else{
            echo "Validate Password and try login again";
            // echo "Password must contain atleast one lowercase letter,one uppercase letter and one digit and must by 8 character long";
        }
    }else{
        echo "Validate Email and try login again";
    }
}else{
    echo "Something went wrong. Problem in establishing Connection. Try Again";
}
?>