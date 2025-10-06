<?php

session_start();

session_unset();
session_destroy();

header("location: ../website/modules/login/login.php");

?>