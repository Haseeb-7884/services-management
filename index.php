<?php
include("includes/connection.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DigiScale - Grow Your Social Media</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">

    <?php
    if (isset($_SESSION['id'])) {
    ?>
        <link rel="stylesheet" href="assets/css/navbar_main.css">
    <?php
    } else {
    ?>
        <link rel="stylesheet" href="assets/css/navbar_second.css">
    <?php
    }
    ?>

    <!-- Pricing Carousel CSS -->
    <style>
        .smpricing-wrapper {
            background: linear-gradient(135deg, #0f1b2d 0%, #1a2942 100%);
            padding: 60px 0;
            position: relative;
            overflow: hidden;
        }

        .smpricing-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .smpricing-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 12px;
        }

        .smpricing-subtitle {
            font-size: 1rem;
            color: #94a3b8;
            font-weight: 400;
            max-width: 600px;
            margin: 0 auto;
        }

        .smpricing-carousel-container {
            position: relative;
            max-width: 1300px;
            margin: 0 auto;
            padding: 0 60px;
        }

        .smpricing-cards-wrapper {
            position: relative;
            overflow: hidden;
            width: 100%;
        }

        .smpricing-cards-track {
            display: flex;
            gap: 20px;
            transition: transform 0.4s ease;
            padding: 20px 0;
        }

        .smpricing-card {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 12px;
            padding: 25px 20px;
            width: 300px;
            flex-shrink: 0;
            position: relative;
            border: 1px solid rgba(148, 163, 184, 0.1);
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .smpricing-card:hover {
            transform: translateY(-5px);
            border-color: rgba(6, 182, 212, 0.5);
            box-shadow: 0 10px 25px rgba(6, 182, 212, 0.25);
            background: rgba(30, 41, 59, 0.7);
        }

        .smpricing-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: #ffffff;
            padding: 4px 16px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
            z-index: 1;
        }

        .smpricing-card-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
            margin-top: 5px;
        }

        .smpricing-card-desc {
            font-size: 0.85rem;
            color: #94a3b8;
            line-height: 1.4;
            margin-bottom: 20px;
            min-height: 38px;
        }

        .smpricing-price {
            margin-bottom: 20px;
        }

        .smpricing-amount {
            font-size: 2.2rem;
            font-weight: 700;
            color: #06b6d4;
            line-height: 1;
        }

        .smpricing-period {
            font-size: 0.95rem;
            color: #94a3b8;
            font-weight: 400;
        }

        .smpricing-features {
            list-style: none;
            padding: 0;
            margin: 0 0 25px 0;
        }

        .smpricing-feature {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
            color: #e2e8f0;
            font-size: 0.82rem;
        }

        .smpricing-check {
            color: #06b6d4;
            margin-right: 8px;
            font-size: 0.9rem;
            margin-top: 2px;
            flex-shrink: 0;
        }

        .smpricing-btn {
            width: 100%;
            padding: 12px 16px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .smpricing-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(6, 182, 212, 0.5);
        }

        .smpricing-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid rgba(6, 182, 212, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 20;
            transition: all 0.3s ease;
            color: #06b6d4;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .smpricing-nav-btn:hover {
            background: #ffffff;
            border-color: #06b6d4;
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
        }

        .smpricing-nav-left {
            left: 10px;
        }

        .smpricing-nav-right {
            right: 10px;
        }

        .smpricing-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 25px;
        }

        .smpricing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(148, 163, 184, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .smpricing-dot.active {
            background: #06b6d4;
            width: 20px;
            border-radius: 4px;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .smpricing-wrapper {
                padding: 50px 0;
            }

            .smpricing-title {
                font-size: 1.7rem;
            }

            .smpricing-subtitle {
                font-size: 0.95rem;
            }

            .smpricing-carousel-container {
                padding: 0 15px;
            }

            .smpricing-cards-wrapper {
                overflow-x: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .smpricing-cards-wrapper::-webkit-scrollbar {
                display: none;
            }

            .smpricing-cards-track {
                transform: none !important;
                transition: none;
            }

            .smpricing-card {
                width: 280px;
                padding: 20px 16px;
            }

            .smpricing-nav-btn {
                display: none;
            }
        }

        @media (max-width: 576px) {
            .smpricing-wrapper {
                padding: 40px 0;
            }

            .smpricing-title {
                font-size: 1.5rem;
            }

            .smpricing-subtitle {
                font-size: 0.9rem;
            }

            .smpricing-carousel-container {
                padding: 0 10px;
            }

            .smpricing-card {
                width: 260px;
                padding: 18px 14px;
            }
        }
    </style>
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
                    DigiScale
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
                            <a class="nav-link" href="includes/pages/blogs/blog_list.php">Blog</a>
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

                        <?php
                        if (isset($_SESSION['id'])) {
                            $logID = $_SESSION['id'];
                            $fetchObj = new backend();
                            $cartData = $fetchObj->fetching("cart", "*", null, $logID);
                            if (!empty($cartData)) {
                                $cartCount = count($cartData);
                        ?>
                                <a href="includes/pages/cart_details.php" class="sg-cart-wrapper text-decoration-none">
                                    <i class="fa-solid fa-cart-plus"></i>
                                    <span class="sg-cart-notification"><?= $cartCount ?></span>
                                </a>
                            <?php
                            } else {
                            ?>
                                <a href="includes/pages/cart_details.php" class="sg-cart-wrapper text-decoration-none">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </a>
                            <?php
                            }
                        } else {
                            ?>
                            <a href="includes/pages/cart_details.php" class="sg-cart-wrapper text-decoration-none">
                                <i class="fa-solid fa-cart-shopping"></i>
                            </a>
                        <?php
                        }
                        ?>

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
                                    <a class="dropdown-item" href="includes/logout.php">
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
                                $cartData = $fetchObj->fetching("cart", "*", null, $logID);
                                if (!empty($cartData)) {
                                    $cartCount = count($cartData);
                                }
                            ?>
                                <a href="includes/pages/cart_details.php" class="sg-cart-wrapper text-decoration-none">
                                    <i class="bi bi-cart3"></i>
                                    <span class="sg-cart-notification"><?= $cartCount ?></span>
                                </a>
                            <?php
                            } else {
                            ?>
                                <a href="includes/pages/cart_details.php" class="sg-cart-wrapper text-decoration-none">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </a>
                            <?php
                            }
                            ?>
                        </li>
                        <li class="nav-item"><a class="btn btn-primary-custom ms-lg-3" href="includes/pages/logins/signup.php">Get Started</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    <?php
    }
    ?>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-5 mb-lg-0">
                    <p class="text-cyan text-uppercase mb-3">Social Media Marketing</p>
                    <h1 class="hero-title mb-4">
                        Grow Your Social Media With
                        <span class="text-cyan">Professional Expertise</span>
                    </h1>
                    <p class="hero-description mb-4">
                        Boost your social media presence with our expert marketing strategies. Our team specializes in organic growth and effective social media campaigns that deliver real results.
                    </p>
                    <div class="hero-buttons">
                        <a href="includes/pages/blogs/blog_list.php" class="btn btn-cyan me-3">Learn More</a>
                        <a href="#start" class="btn btn-outline-light">Live Demo</a>
                    </div>

                    <!-- Stats Row -->
                    <div class="row stats-row mt-5">
                        <div class="col-4">
                            <h3 class="stat-number">50M+</h3>
                            <p class="stat-label">Users</p>
                        </div>
                        <div class="col-4">
                            <h3 class="stat-number">98%</h3>
                            <p class="stat-label">Satisfaction</p>
                        </div>
                        <div class="col-4">
                            <h3 class="stat-number">24/7</h3>
                            <p class="stat-label">Support</p>
                        </div>
                    </div>
                </div>

                <!-- Hero Right Side - Analytics Dashboard -->
                <div class="col-lg-6">
                    <div class="analytics-card">
                        <div class="analytics-header mb-4">
                            <h4>Monthly Analytics</h4>
                            <span class="month-badge">APR</span>
                        </div>

                        <div class="row mb-3">
                            <div class="col-6">
                                <div class="metric-box">
                                    <p class="metric-label">Posts</p>
                                    <h3 class="metric-value">2.5M</h3>
                                    <span class="metric-change positive">+12.5%</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="metric-box">
                                    <p class="metric-label">Likes</p>
                                    <h3 class="metric-value">8.6%</h3>
                                    <span class="metric-change positive">+2.4%</span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-6">
                                <div class="metric-box">
                                    <p class="metric-label">Followers</p>
                                    <h3 class="metric-value">3.7M</h3>
                                    <span class="metric-change positive">+8.2%</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="metric-box">
                                    <p class="metric-label">Growth</p>
                                    <h3 class="metric-value">200%</h3>
                                    <span class="metric-change positive">+15%</span>
                                </div>
                            </div>
                        </div>

                        <p class="analytics-footer mt-3">By business performance criteria</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Image Section -->
        <div class="container mt-5">
            <div class="team-image-container">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop" alt="Team Working" class="img-fluid rounded-3">
                <div class="image-dots">
                    <span class="dot active"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Our Services</h2>
                <p class="section-subtitle">We leverage expert tools to deliver a tailored plan based on your unique needs</p>
            </div>

            <div class="row g-4">

                <?php
                $fetchObj = new backend();
                $services_details = $fetchObj->fetching("marketplaces", "*", null, null);
                if (!empty($services_details)) {
                    foreach ($services_details as $services) {
                        $marketplace_id = $services['id'];
                        $marketplace_name = $services['marketplace_name'];
                        $marketplace_description = $services['marketplace_description'];
                        $marketplace_features = $services['marketplace_features'];
                ?>

                        <!-- Service Card -->
                        <div class="col-lg-6">
                            <div class="service-card">
                                <?php
                                if ($marketplace_name == "Instagram") {
                                ?>
                                    <div class='service-icon instagram'>
                                        <i class='fab fa-instagram'></i>
                                    </div>
                                <?php
                                } else if ($marketplace_name == "TikTok") {
                                ?>

                                    <div class='service-icon tiktok'>
                                        <i class='fab fa-tiktok'></i>
                                    </div>

                                <?php
                                } else if ($marketplace_name == "Facebook") {
                                ?>
                                    <div class='service-icon facebook'>
                                        <i class='fab fa-facebook-f'></i>
                                    </div>
                                <?php
                                } else if ($marketplace_name == "YouTube") {
                                ?>
                                    <div class='service-icon youtube'>
                                        <i class='fab fa-youtube'></i>
                                    </div>
                                <?php
                                }
                                ?>

                                <h3 class="service-title"><?= $marketplace_name ?> Growth</h3>
                                <p class="service-description"><?= $marketplace_description ?></p>

                                <ul class="service-features">
                                    <?php
                                    $features = explode(':', $marketplace_features);
                                    foreach ($features as $feature) {
                                        echo "<li><i class='fas fa-check-circle'></i> $feature</li>";
                                    }
                                    ?>

                                </ul>

                                <a href="includes/pages/service_detials.php?marketplace_id=<?= $marketplace_id ?>" class="text-decoration-none btn btn-service w-100">Learn More</a>
                            </div>
                        </div>

                <?php
                    }
                } else {
                    echo "No services uploaded yet";
                }
                ?>

            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section id="about" class="why-choose-section py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Why Choose Us</h2>
                <p class="section-subtitle">Exceptional results with expert tools and dedicated support for your complete satisfaction</p>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-lg-3 col-md-6">
                    <div class="feature-box text-center">
                        <div class="feature-icon-box">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4 class="feature-title">Real Followers</h4>
                        <p class="feature-text">Get genuine followers who engage with your content authentically</p>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="feature-box text-center">
                        <div class="feature-icon-box">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4 class="feature-title">Secure Platform</h4>
                        <p class="feature-text">Your data and privacy are protected with enterprise-grade security</p>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="feature-box text-center">
                        <div class="feature-icon-box">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h4 class="feature-title">Engaged Analytics</h4>
                        <p class="feature-text">Track your growth with detailed analytics and insights</p>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                    <div class="feature-box text-center">
                        <div class="feature-icon-box">
                            <i class="fas fa-headset"></i>
                        </div>
                        <h4 class="feature-title">Easy Management</h4>
                        <p class="feature-text">Simple dashboard to manage all your social media accounts</p>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div class="row g-4 text-center">
                <div class="col-lg-3 col-6">
                    <div class="stat-box">
                        <h2 class="stat-big-number">100%</h2>
                        <p class="stat-big-label">Satisfaction</p>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="stat-box">
                        <h2 class="stat-big-number">10K+</h2>
                        <p class="stat-big-label">Clients</p>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="stat-box">
                        <h2 class="stat-big-number">50M+</h2>
                        <p class="stat-big-label">Followers</p>
                    </div>
                </div>
                <div class="col-lg-3 col-6">
                    <div class="stat-box">
                        <h2 class="stat-big-number">5+</h2>
                        <p class="stat-big-label">Years Experience</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="smpricing-wrapper">
        <div class="container-fluid">

            <div class="smpricing-header">
                <h2 class="smpricing-title">Our Most Popular Packages</h2>
                <p class="smpricing-subtitle">Choose the best plan for your brand's social media growth.</p>
            </div>

            <div class="smpricing-carousel-container">

                <button class="smpricing-nav-btn smpricing-nav-left" id="smpricingPrevBtn">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <div class="smpricing-cards-wrapper">
                    <div class="smpricing-cards-track" id="smpricingTrack">

                        <div class="smpricing-card">
                            <span class="smpricing-badge">Most Popular</span>
                            <h3 class="smpricing-card-title">Growth Pro</h3>
                            <p class="smpricing-card-desc">
                                Accelerate your brand with comprehensive social media management and growth strategies.
                            </p>
                            <div class="smpricing-price">
                                <span class="smpricing-amount">$999</span>
                                <span class="smpricing-period">/mo</span>
                            </div>
                            <ul class="smpricing-features">
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>20 Custom Posts per Month</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Advanced Analytics & Reporting</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>4 Social Media Platforms</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Priority Community Management</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Bi-Weekly Strategy Sessions</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Influencer Outreach</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Paid Ad Campaign Setup</span>
                                </li>
                            </ul>
                            <button class="smpricing-btn">Get Started</button>
                        </div>

                        <div class="smpricing-card">
                            <h3 class="smpricing-card-title">Enterprise Elite</h3>
                            <p class="smpricing-card-desc">
                                Complete social media domination with dedicated account management and custom strategies.
                            </p>
                            <div class="smpricing-price">
                                <span class="smpricing-amount">$1,999</span>
                                <span class="smpricing-period">/mo</span>
                            </div>
                            <ul class="smpricing-features">
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Unlimited Custom Posts</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Real-Time Analytics Suite</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>All Major Platforms</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>24/7 Community Management</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Weekly Strategy Calls</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Full Influencer Campaigns</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Advanced Paid Ad Management</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Dedicated Account Manager</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Custom API Integration</span>
                                </li>
                            </ul>
                            <button class="smpricing-btn">Get Started</button>
                        </div>

                        <div class="smpricing-card">
                            <h3 class="smpricing-card-title">Content Boost</h3>
                            <p class="smpricing-card-desc">
                                High-impact content creation focused on engagement and viral potential.
                            </p>
                            <div class="smpricing-price">
                                <span class="smpricing-amount">$749</span>
                                <span class="smpricing-period">/mo</span>
                            </div>
                            <ul class="smpricing-features">
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>15 Premium Posts per Month</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Video Content Creation</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>3 Social Media Platforms</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Hashtag Strategy</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Engagement Analytics</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Content Calendar Planning</span>
                                </li>
                            </ul>
                            <button class="smpricing-btn">Get Started</button>
                        </div>

                        <div class="smpricing-card">
                            <h3 class="smpricing-card-title">Social Starter</h3>
                            <p class="smpricing-card-desc">
                                Perfect for small businesses looking to establish their social media presence.
                            </p>
                            <div class="smpricing-price">
                                <span class="smpricing-amount">$499</span>
                                <span class="smpricing-period">/mo</span>
                            </div>
                            <ul class="smpricing-features">
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>10 Custom Posts per Month</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>2 Social Media Platforms</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Basic Analytics Dashboard</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Community Engagement</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Monthly Strategy Review</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Content Calendar</span>
                                </li>
                            </ul>
                            <button class="smpricing-btn">Get Started</button>
                        </div>

                        <div class="smpricing-card">
                            <h3 class="smpricing-card-title">Video Focus</h3>
                            <p class="smpricing-card-desc">
                                Specialized package for businesses wanting to leverage video content.
                            </p>
                            <div class="smpricing-price">
                                <span class="smpricing-amount">$899</span>
                                <span class="smpricing-period">/mo</span>
                            </div>
                            <ul class="smpricing-features">
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>8 Video Posts per Month</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Professional Video Editing</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Video Strategy Development</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Platform Optimization</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Performance Analytics</span>
                                </li>
                                <li class="smpricing-feature">
                                    <i class="fas fa-check-circle smpricing-check"></i>
                                    <span>Video SEO</span>
                                </li>
                            </ul>
                            <button class="smpricing-btn">Get Started</button>
                        </div>

                    </div>
                </div>

                <button class="smpricing-nav-btn smpricing-nav-right" id="smpricingNextBtn">
                    <i class="fas fa-chevron-right"></i>
                </button>

            </div>

            <div class="smpricing-dots" id="smpricingDots"></div>

        </div>
    </section>

    <!-- Trusted Section -->
    <section class="trusted-section py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Trusted by businesses <span class="text-cyan">worldwide</span></h2>
                <p class="section-subtitle">Over 10,000 satisfied clients have trusted us to grow their social media presence and achieve their goals</p>
            </div>

            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="trust-card text-center">
                        <div class="trust-icon">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h4 class="trust-title">Verified Growth</h4>
                        <p class="trust-text">Unlock effective lead generation and conversion with carefully crafted strategies tailored to grow your business</p>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="trust-card text-center">
                        <div class="trust-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h4 class="trust-title">Global Reach</h4>
                        <p class="trust-text">Expand your social reach with our globally trusted platform and connect with audiences worldwide</p>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="trust-card text-center">
                        <div class="trust-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <h4 class="trust-title">Award Winning</h4>
                        <p class="trust-text">Recognized with industry awards for excellence in social media growth and digital marketing services</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials-section py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">What Our Clients Say</h2>
                <p class="section-subtitle">Real feedback from satisfied customers who have experienced remarkable growth with our services</p>
            </div>

            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"The best decision I made for my business! SocialGrowth helped me gain 50K followers in just 3 months. The engagement is real and the results are amazing."</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">Sarah Johnson</h5>
                                <p class="author-role mb-0">Fashion Blogger</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Outstanding service! My Instagram engagement increased by 300% within the first month. The team is professional and the strategies work perfectly."</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">Michael Chen</h5>
                                <p class="author-role mb-0">Business Owner</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"I was skeptical at first, but SocialGrowth exceeded all my expectations. Real followers, great engagement, and excellent customer support. Highly recommended!"</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">Emma Rodriguez</h5>
                                <p class="author-role mb-0">Content Creator</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Simply amazing! The analytics dashboard is incredible and the growth has been consistent. Worth every penny invested in my social media presence."</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">David Anderson</h5>
                                <p class="author-role mb-0">Digital Marketer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Best investment for my brand! My TikTok account went viral and I gained over 100K followers. The team knows exactly what they're doing."</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">Lisa K.</h5>
                                <p class="author-role mb-0">Influencer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="testimonial-card">
                        <div class="stars mb-3">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <p class="testimonial-text">"Professional, reliable, and results-driven. My YouTube channel has grown exponentially thanks to their expert strategies and continuous support."</p>
                        <div class="testimonial-author d-flex align-items-center mt-4">
                            <div class="author-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h5 class="author-name mb-0">Robert Martinez</h5>
                                <p class="author-role mb-0">YouTuber</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-5">
                <button class="btn btn-outline-cyan">
                    <i class="fas fa-arrow-right me-2"></i> +500k from 100+ reviews
                </button>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="start" class="cta-section py-5">
        <div class="container">
            <div class="text-center">
                <h2 class="cta-title mb-4">Ready to Scale Your <span class="text-cyan">Social Media Growth?</span></h2>
                <p class="cta-subtitle mb-5">Our team is ready to help you achieve your goals with proven strategies and expert guidance</p>

                <div class="cta-buttons">
                    <a href="#" class="btn btn-cyan me-3">Get Started Now</a>
                    <a href="#" class="btn btn-outline-light">Schedule a Call</a>
                </div>

                <p class="cta-note mt-4">No credit card required • Free consultation available</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h5 class="footer-brand mb-3">
                        <i class="fas fa-chart-line"></i> DigiScale
                    </h5>
                    <p class="footer-text">Transform your social media presence with professional expertise and proven strategies that deliver real results.</p>
                </div>

                <div class="col-lg-2 col-6 mb-4 mb-lg-0">
                    <h6 class="footer-title">Services</h6>
                    <ul class="footer-links">
                        <li><a href="#services">Instagram</a></li>
                        <li><a href="#services">Facebook</a></li>
                        <li><a href="#services">TikTok</a></li>
                        <li><a href="#services">YouTube</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-6 mb-4 mb-lg-0">
                    <h6 class="footer-title">Company</h6>
                    <ul class="footer-links">
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#testimonials">Reviews</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-6 mb-4 mb-lg-0">
                    <h6 class="footer-title">Legal</h6>
                    <ul class="footer-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                        <li><a href="#">GDPR</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-6">
                    <h6 class="footer-title">Social</h6>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>

            <hr class="footer-divider my-4">

            <div class="row">
                <div class="col-md-6 text-center text-md-start">
                    <p class="copyright mb-0">© 2025 SocialGrowth. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <a href="#" class="btn btn-scroll-top">
                        <i class="fas fa-arrow-up"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript -->
    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(5, 20, 35, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(5, 20, 35, 0.9)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Pricing Carousel Script - COMPLETELY FIXED
        document.addEventListener('DOMContentLoaded', function() {
            const track = document.getElementById('smpricingTrack');
            const prevBtn = document.getElementById('smpricingPrevBtn');
            const nextBtn = document.getElementById('smpricingNextBtn');
            const dotsContainer = document.getElementById('smpricingDots');
            const wrapper = track.parentElement;

            if (!track || !prevBtn || !nextBtn || !dotsContainer) {
                console.log('Carousel elements not found');
                return;
            }

            const cards = track.querySelectorAll('.smpricing-card');
            const cardWidth = 300;
            const gap = 20;
            let currentPosition = 0;
            let currentIndex = 0;
            let isMobile = window.innerWidth <= 768;

            function getCardsPerView() {
                if (window.innerWidth <= 768) {
                    return 1;
                } else {
                    const containerWidth = wrapper.offsetWidth;
                    return Math.floor(containerWidth / (cardWidth + gap));
                }
            }

            let cardsPerView = getCardsPerView();

            function generateDots() {
                dotsContainer.innerHTML = '';
                const totalDots = Math.ceil(cards.length / cardsPerView);

                for (let i = 0; i < totalDots; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'smpricing-dot';
                    if (i === 0) dot.classList.add('active');
                    dot.setAttribute('data-index', i);
                    dotsContainer.appendChild(dot);
                }
            }

            function updateDots(index) {
                const dots = dotsContainer.querySelectorAll('.smpricing-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }

            function moveCarousel() {
                const maxPosition = Math.max(0, (cards.length - cardsPerView) * (cardWidth + gap));
                currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));

                if (!isMobile) {
                    track.style.transform = `translateX(-${currentPosition}px)`;
                }

                currentIndex = Math.round(currentPosition / ((cardWidth + gap) * cardsPerView));
                updateDots(currentIndex);
            }

            function initCarousel() {
                isMobile = window.innerWidth <= 768;
                cardsPerView = getCardsPerView();

                if (isMobile) {
                    wrapper.style.overflowX = 'auto';
                    track.style.transform = 'none';
                    track.style.transition = 'none';
                } else {
                    wrapper.style.overflowX = 'hidden';
                    track.style.transition = 'transform 0.4s ease';
                }

                generateDots();
                moveCarousel();
            }

            // Desktop navigation
            prevBtn.addEventListener('click', function() {
                if (!isMobile) {
                    currentPosition = Math.max(0, currentPosition - (cardWidth + gap) * cardsPerView);
                    moveCarousel();
                }
            });

            nextBtn.addEventListener('click', function() {
                if (!isMobile) {
                    const maxPosition = (cards.length - cardsPerView) * (cardWidth + gap);
                    currentPosition = Math.min(maxPosition, currentPosition + (cardWidth + gap) * cardsPerView);
                    moveCarousel();
                }
            });

            // Dot navigation
            dotsContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('smpricing-dot') && !isMobile) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    currentPosition = index * (cardWidth + gap) * cardsPerView;
                    moveCarousel();
                }
            });

            // Mobile scroll detection
            if (window.innerWidth <= 768) {
                wrapper.addEventListener('scroll', function() {
                    const scrollLeft = wrapper.scrollLeft;
                    const cardWidthWithGap = cardWidth + gap;
                    const newIndex = Math.round(scrollLeft / cardWidthWithGap);

                    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < Math.ceil(cards.length / cardsPerView)) {
                        currentIndex = newIndex;
                        updateDots(currentIndex);
                    }
                });
            }

            // Handle resize
            window.addEventListener('resize', function() {
                initCarousel();
            });

            // Initialize
            initCarousel();
        });
    </script>
</body>

</html>