<?php
// include("../../connection.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SocialGrowth Navbar</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

    <!-- Custom CSS -->
    <?php
    if (isset($_SESSION['id'])) {
    ?>
        <link rel="stylesheet" href="../../../assets/css/navbar_main.css">
    <?php
    } else {
    ?>
        <link rel="stylesheet" href="../../../assets/css/navbar_second.css">
        <link rel="stylesheet" href="../../../assets/css/style.css">
    <?php
    }
    ?>



</head>

<body>
    <?php
    if (isset($_SESSION['id'])) {
    ?>
        <!-- Main Navigation Bar with Custom Class -->
        <nav class="navbar navbar-expand-lg navbar-dark sg-navbar-custom">
            <div class="container-fluid">

                <!-- Brand Logo and Name -->
                <a class="navbar-brand d-flex align-items-center sg-brand-wrapper" href="#">
                    <i class="bi bi-graph-up-arrow sg-logo-icon"></i>
                    SocialGrowth
                </a>

                <!-- Mobile Toggle Button with Custom Class -->
                <button class="navbar-toggler sg-navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#sgNavbarContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Collapsible Navigation Content -->
                <div class="collapse navbar-collapse justify-content-end" id="sgNavbarContent">

                    <!-- Navigation Links Aligned to Right -->
                    <ul class="navbar-nav sg-nav-links">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Packages</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Blog</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Testimonials</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Contact</a>
                        </li>
                    </ul>

                    <!-- Right Side: Cart and Account Dropdown -->
                    <div class="d-flex align-items-center">

                        <!-- Shopping Cart Icon with Notification Badge -->
                        <a href="#" class="sg-cart-wrapper text-decoration-none">
                            <i class="bi bi-cart3"></i>
                            <span class="sg-cart-notification">2</span>
                        </a>

                        <!-- My Account Dropdown -->
                        <div class="dropdown">
                            <button class="btn dropdown-toggle sg-account-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                My Account
                            </button>

                            <!-- Dropdown Menu with Custom Class -->
                            <ul class="dropdown-menu dropdown-menu-end sg-dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#">
                                        <i class="bi bi-speedometer2 me-2"></i>Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#">
                                        <i class="bi bi-person me-2"></i>Profile
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider" style="border-color: rgba(255, 255, 255, 0.1);">
                                </li>
                                <li>
                                    <a class="dropdown-item" href="../../logout.php">
                                        <i class="bi bi-box-arrow-right me-2"></i>Logout
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    <?php
    } else {
    ?>
        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <i class="fas fa-chart-line"></i> DigiScale
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                        <li class="nav-item"><a class="nav-link" href="#testimonials">Testimonials</a></li>
                        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                        <li class="nav-item">
                            <?php
                            if (isset($_SESSION['id'])) {
                                $logID = $_SESSION['id'];
                                $fetchObj = new backend();
                                $cartData = $fetchObj->fetching("cart", "*", null,$logID);
                                if(!empty($cartData)){
                                    $cartCount = count($cartData);
                                }
                            ?>
                                <a href="#" class="sg-cart-wrapper text-decoration-none">
                                    <i class="bi bi-cart3"></i>
                                    <span class="sg-cart-notification"><?=$cartCount?></span>
                                </a>
                            <?php
                            } else {
                            ?>
                                <a href="#" class="sg-cart-wrapper text-decoration-none">
                                    <i class="bi bi-cart3"></i>
                                </a>
                            <?php
                            }
                            ?>
                        </li>
                        <li class="nav-item"><a class="btn btn-primary-custom ms-lg-3" href="../logins/signup.php">Get Started</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    <?php
    }
    ?>
    <!-- Bootstrap 5 JS Bundle (includes Popper for dropdown functionality) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>