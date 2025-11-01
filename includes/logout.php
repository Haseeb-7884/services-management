<?php

session_start();

session_unset();
session_destroy();

header("location: ../includes/pages/logins/login.php");

?>
