<?php
include("../connection.php");
$fetchObj = new backend();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SocialBoost - Grow Your Instagram Presence</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="../../assets/css/services_detials.css">
    <style>
        /* Star Rating Styles */
        .star-rating {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }

        .star-rating i {
            font-size: 1.8rem;
            color: #6b7280;
            /* Default gray color for unselected stars */
            cursor: pointer;
            transition: color 0.2s ease, transform 0.2s ease;
        }

        .star-rating i:hover {
            transform: scale(1.1);
        }

        .star-rating i.active {
            color: #ffc107;
            /* Yellow color for selected stars */
        }

        .star-rating i.hover {
            color: #ffc107;
            /* Yellow color on hover */
        }

        .rating-text {
            color: #b0bec5;
            font-size: 0.9rem;
            margin-top: 5px;
            font-weight: 500;
        }
    </style>
</head>

<body>

    <?php
    if (isset($_GET['marketplace_id'])) {
        $marketplace_id = $_GET['marketplace_id'];
    }
    ?>

    <!-- ===== HERO SECTION ===== -->
    <section class="hero-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <?php
                    $gettingMarketplace = $fetchObj->fetching("marketplaces", "*", null, "id = $marketplace_id");
                    if (!empty($gettingMarketplace)) {
                        $marketplace = $gettingMarketplace[0]['marketplace_name'];
                        $marketplace_description = $gettingMarketplace[0]['marketplace_description'];
                    ?>
                        <h1>
                            Grow Your <?= $marketplace ?><br>
                            <span class="gradient-text">Presence Today</span>
                        </h1>
                        <p><?= $marketplace_description ?></p>
                    <?php
                    }
                    ?>

                    <div class="hero-buttons">
                        <button class="btn btn-primary-custom">Explore Packages</button>
                        <a href="../pages/blogs/blog_list.php" class="btn btn-secondary-custom">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== PACKAGES SECTION ===== -->
    <section class="packages-section">
        <div class="container">
            <!-- Section Header -->
            <div class="row">
                <div class="col-12 text-center">
                    <?php
                    $gettingMarketplace = $fetchObj->fetching("marketplaces", "*", null, "id = $marketplace_id");
                    if (!empty($gettingMarketplace)) {
                        $marketplace = $gettingMarketplace[0]['marketplace_name'];
                        $marketplace_description = $gettingMarketplace[0]['marketplace_description'];
                    ?>
                        <h2 class="section-title"><?= $marketplace ?> Growth Packages</h2>
                        <p class="section-subtitle"><?= $marketplace_description ?></p>
                    <?php
                    }
                    ?>
                </div>
            </div>

            <div class="row">
                <!-- Main Packages Column -->
                <div class="col-lg-8">
                    <div class="row">
                        <?php
                        $gettingMarketplacePackages = $fetchObj->fetching("marketplace_services", "*", null, "marketplace_id = $marketplace_id");
                        if (!empty($gettingMarketplacePackages)) {
                            foreach ($gettingMarketplacePackages as $marketplacePackage) {
                                $package_id = $marketplacePackage['id'];
                                $package_name = $marketplacePackage['package_name'];
                                $price_origional = $marketplacePackage['price_origional'];
                                $old_price = !empty($marketplacePackage['old_price']) ? '$' . $marketplacePackage['old_price'] : null;
                                $engagement = $marketplacePackage['engagement'];
                                $package_features = $marketplacePackage['features'];
                                $status = $marketplacePackage['status'];

                        ?>
                                <div class="col-md-6">
                                    <div class="package-card">
                                        <?php
                                        if ($status == null) {
                                        ?>
                                            <div class="package-header platinum-gradient">
                                                <i class="fab fa-<?php echo strtolower($marketplace); ?>"></i>
                                            </div>
                                        <?php
                                        } elseif ($status == 'most_popular') {
                                        ?>
                                            <div class="package-badge">MOST POPULAR</div>
                                            <div class="package-header golden-gradient">
                                                <i class="fab fa-<?php echo strtolower($marketplace); ?>"></i>
                                            </div>
                                        <?php
                                        } elseif ($status == 'popular') {
                                        ?>
                                            <div class="package-badge">POPULAR</div>
                                            <div class="package-header pro-gradient">
                                                <i class="fab fa-<?php echo strtolower($marketplace); ?>"></i>
                                            </div>
                                        <?php
                                        } elseif ($status == 'featured') {
                                        ?>
                                            <div class="package-badge">FEATURED</div>
                                            <div class="package-header diamond-gradient">
                                                <i class="fab fa-<?php echo strtolower($marketplace); ?>"></i>
                                            </div>
                                        <?php
                                        }
                                        ?>

                                        <div class="package-body">
                                            <h3 class="package-name"><?= $package_name ?></h3>
                                            <div class="package-price">
                                                $<?= $price_origional ?> <small><?= $old_price ?></small>
                                            </div>
                                            <div class="package-stats">
                                                <div class="stat-item">
                                                    <div class="stat-label">Followers</div>
                                                    <div class="stat-value">10,000</div>
                                                </div>
                                                <?php
                                                if ($engagement == null) {
                                                    echo null;
                                                } else if (!empty($engagement) == 'high') {
                                                ?>
                                                    <div class="stat-item">
                                                        <div class="stat-label">Engagement</div>
                                                        <div class="stat-value">High</div>
                                                    </div>
                                                <?php
                                                } else if (!empty($engagement) == 'low') {
                                                ?>
                                                    <div class="stat-item">
                                                        <div class="stat-label">Engagement</div>
                                                        <div class="stat-value">Low</div>
                                                    </div>
                                                <?php
                                                }
                                                ?>
                                                <div class="stat-item">
                                                    <div class="stat-label">Delivery</div>
                                                    <div class="stat-value">7-10 days</div>
                                                </div>
                                            </div>
                                            <ul class="package-features">
                                                <?php
                                                if (!empty($package_features)) {
                                                    $features = explode(':', $package_features);
                                                    foreach ($features as $feature) {
                                                        echo "<li><i class='fas fa-check-circle'></i> $feature</li>";
                                                    }
                                                } else {
                                                    echo null;
                                                }
                                                ?>
                                            </ul>
                                            <a href="services_content.php?marketplaceID=<?= $marketplace_id ?>&PackageID=<?= $package_id ?>" class="btn btn-get-started">Get Started</a>
                                        </div>
                                    </div>
                                </div>
                        <?php
                            } // foreach loops ends here
                        } else {
                            echo "No package avilable for this marketplace";
                        }
                        ?>
                        <!-- Platinum Package -->
                        <!-- <div class="col-md-6">
                            <div class="package-card">
                                <div class="package-badge">MOST POPULAR</div>
                                <div class="package-header platinum-gradient">
                                    <i class="fab fa-instagram"></i>
                                </div>
                                <div class="package-body">
                                    <h3 class="package-name">Platinum Package</h3>
                                    <div class="package-price">
                                        $249.99 <small>$349.99</small>
                                    </div>
                                    <div class="package-stats">
                                        <div class="stat-item">
                                            <div class="stat-label">Followers</div>
                                            <div class="stat-value">25,000</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Engagement</div>
                                            <div class="stat-value">Very High</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Delivery</div>
                                            <div class="stat-value">10-14 days</div>
                                        </div>
                                    </div>
                                    <ul class="package-features">
                                        <li><i class="fas fa-check-circle"></i> Real followers</li>
                                        <li><i class="fas fa-check-circle"></i> Targeted audience</li>
                                        <li><i class="fas fa-check-circle"></i> Priority support</li>
                                        <li><i class="fas fa-check-circle"></i> Analytics dashboard</li>
                                    </ul>
                                    <a href="services_content.html" class="btn btn-get-started">Get Started</a>
                                </div>
                            </div>
                        </div> -->

                        <!-- Silver Package -->
                        <!-- <div class="col-md-6">
                            <div class="package-card">
                                <div class="package-header silver-gradient">
                                    <i class="fab fa-instagram"></i>
                                </div>
                                <div class="package-body">
                                    <h3 class="package-name">Silver Package</h3>
                                    <div class="package-price">
                                        $79.99 <small>$129.99</small>
                                    </div>
                                    <div class="package-stats">
                                        <div class="stat-item">
                                            <div class="stat-label">Followers</div>
                                            <div class="stat-value">5,000</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Engagement</div>
                                            <div class="stat-value">Medium</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Delivery</div>
                                            <div class="stat-value">5-7 days</div>
                                        </div>
                                    </div>
                                    <ul class="package-features">
                                        <li><i class="fas fa-check-circle"></i> Real followers</li>
                                        <li><i class="fas fa-check-circle"></i> Organic growth</li>
                                        <li><i class="fas fa-check-circle"></i> Email support</li>
                                        <li><i class="fas fa-check-circle"></i> Safe & secure</li>
                                    </ul>
                                    <a href="services_content.html" class="btn btn-get-started">Get Started</a>
                                </div>
                            </div>
                        </div> -->

                        <!-- Diamond Package -->
                        <!-- <div class="col-md-6">
                            <div class="package-card">
                                <div class="package-badge">MOST POPULAR</div>
                                <div class="package-header diamond-gradient">
                                    <i class="fab fa-instagram"></i>
                                </div>
                                <div class="package-body">
                                    <h3 class="package-name">Diamond Package</h3>
                                    <div class="package-price">
                                        $499.99 <small>$699.99</small>
                                    </div>
                                    <div class="package-stats">
                                        <div class="stat-item">
                                            <div class="stat-label">Followers</div>
                                            <div class="stat-value">50,000</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Engagement</div>
                                            <div class="stat-value">Maximum</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Delivery</div>
                                            <div class="stat-value">14-21 days</div>
                                        </div>
                                    </div>
                                    <ul class="package-features">
                                        <li><i class="fas fa-check-circle"></i> VIP followers</li>
                                        <li><i class="fas fa-check-circle"></i> Advanced targeting</li>
                                        <li><i class="fas fa-check-circle"></i> Dedicated manager</li>
                                        <li><i class="fas fa-check-circle"></i> Lifetime guarantee</li>
                                    </ul>
                                    <a href="services_content.html" class="btn btn-get-started">Get Started</a>
                                </div>
                            </div>
                        </div> -->

                        <!-- Starter Package -->
                        <!-- <div class="col-md-6">
                            <div class="package-card">
                                <div class="package-header starter-gradient">
                                    <i class="fab fa-instagram"></i>
                                </div>
                                <div class="package-body">
                                    <h3 class="package-name">Starter Package</h3>
                                    <div class="package-price">
                                        $39.99 <small>$59.99</small>
                                    </div>
                                    <div class="package-stats">
                                        <div class="stat-item">
                                            <div class="stat-label">Followers</div>
                                            <div class="stat-value">2,000</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Engagement</div>
                                            <div class="stat-value">Standard</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Delivery</div>
                                            <div class="stat-value">3-5 days</div>
                                        </div>
                                    </div>
                                    <ul class="package-features">
                                        <li><i class="fas fa-check-circle"></i> Real followers</li>
                                        <li><i class="fas fa-check-circle"></i> Basic support</li>
                                        <li><i class="fas fa-check-circle"></i> Gradual delivery</li>
                                        <li><i class="fas fa-check-circle"></i> Money back guarantee</li>
                                    </ul>
                                    <a href="services_content.html" class="btn btn-get-started">Get Started</a>
                                </div>
                            </div>
                        </div> -->

                        <!-- Pro Package -->
                        <!-- <div class="col-md-6">
                            <div class="package-card">
                                <div class="package-header pro-gradient">
                                    <i class="fab fa-instagram"></i>
                                </div>
                                <div class="package-body">
                                    <h3 class="package-name">Pro Package</h3>
                                    <div class="package-price">
                                        $349.99 <small>$499.99</small>
                                    </div>
                                    <div class="package-stats">
                                        <div class="stat-item">
                                            <div class="stat-label">Followers</div>
                                            <div class="stat-value">35,000</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Engagement</div>
                                            <div class="stat-value">Very High</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-label">Delivery</div>
                                            <div class="stat-value">12-16 days</div>
                                        </div>
                                    </div>
                                    <ul class="package-features">
                                        <li><i class="fas fa-check-circle"></i> Premium targeting</li>
                                        <li><i class="fas fa-check-circle"></i> Advanced analytics</li>
                                        <li><i class="fas fa-check-circle"></i> Priority delivery</li>
                                        <li><i class="fas fa-check-circle"></i> Content strategy</li>
                                    </ul>
                                    <a href="services_content.html" class="btn btn-get-started">Get Started</a>
                                </div>
                            </div>
                        </div> -->

                    </div>
                </div>

                <!-- Sidebar Column -->
                <div class="col-lg-4">

                    <!-- Search Box -->
                    <div class="sidebar-card">
                        <input type="text" class="search-box" placeholder="Search packages...">
                    </div>

                    <!-- Popular Packages -->
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">
                            <i class="fas fa-fire"></i> Popular Packages
                        </h3>
                        <div class="popular-item">
                            <span class="popular-name">Golden Package</span>
                            <span class="popular-count">2K Sold</span>
                        </div>
                        <div class="popular-item">
                            <span class="popular-name">Platinum Package</span>
                            <span class="popular-count">1.8K Sold</span>
                        </div>
                        <div class="popular-item">
                            <span class="popular-name">Diamond Package</span>
                            <span class="popular-count">1.5K Sold</span>
                        </div>
                        <div class="popular-item">
                            <span class="popular-name">Pro Package</span>
                            <span class="popular-count">1.2K Sold</span>
                        </div>
                        <div class="popular-item">
                            <span class="popular-name">Silver Package</span>
                            <span class="popular-count">980 Sold</span>
                        </div>
                    </div>

                    <!-- Recent Posts -->
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">
                            <i class="fas fa-clock"></i> Recent Posts
                        </h3>
                        <div class="post-item">
                            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200" alt="Post 1"
                                class="post-image">
                            <div class="post-content">
                                <h6>How to Grow Your Instagram in 2025</h6>
                                <span class="post-date">2 days ago</span>
                            </div>
                        </div>
                        <div class="post-item">
                            <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200" alt="Post 2"
                                class="post-image">
                            <div class="post-content">
                                <h6>Best Practices for Social Media Marketing</h6>
                                <span class="post-date">5 days ago</span>
                            </div>
                        </div>
                        <div class="post-item">
                            <img src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=200" alt="Post 3"
                                class="post-image">
                            <div class="post-content">
                                <h6>Instagram Algorithm Explained</h6>
                                <span class="post-date">1 week ago</span>
                            </div>
                        </div>
                    </div>

                    <!-- Categories -->
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">
                            <i class="fas fa-th-large"></i> Categories
                        </h3>
                        <div class="category-item">
                            <span class="category-name">Instagram Followers</span>
                            <span class="category-count">2K</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">Instagram Likes</span>
                            <span class="category-count">1.5K</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">Instagram Views</span>
                            <span class="category-count">1.2K</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">TikTok Services</span>
                            <span class="category-count">890</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">YouTube Growth</span>
                            <span class="category-count">750</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </section>

   
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript for Rating Stars -->
    <script>

        // ===== STAR RATING FUNCTIONALITY =====
        document.addEventListener('DOMContentLoaded', function() {
            const starRating = document.getElementById('starRating');
            const stars = starRating.querySelectorAll('i');
            const selectedRating = document.getElementById('selectedRating');
            const ratingText = document.getElementById('ratingText');

            // Rating descriptions
            const ratingDescriptions = {
                1: "Poor - Not satisfied",
                2: "Fair - Could be better",
                3: "Good - Met expectations",
                4: "Very Good - Exceeded expectations",
                5: "Excellent - Outstanding experience"
            };

            let currentRating = 0;
            let tempRating = 0;

            // Initialize stars
            stars.forEach(star => {
                // Click event
                star.addEventListener('click', function() {
                    const value = parseInt(this.getAttribute('data-value'));
                    currentRating = value;
                    tempRating = value;
                    setRating(value);
                });

                // Mouseover event
                star.addEventListener('mouseover', function() {
                    const value = parseInt(this.getAttribute('data-value'));
                    tempRating = value;
                    highlightStars(value);
                    ratingText.textContent = ratingDescriptions[value] || "Click on a star to rate";
                });

                // Mouseout event
                star.addEventListener('mouseout', function() {
                    tempRating = currentRating;
                    highlightStars(currentRating);
                    if (currentRating > 0) {
                        ratingText.textContent = ratingDescriptions[currentRating] || "Click on a star to rate";
                    } else {
                        ratingText.textContent = "Click on a star to rate";
                    }
                });
            });

            // Function to set the rating
            function setRating(value) {
                selectedRating.value = value;
                highlightStars(value);
                ratingText.textContent = ratingDescriptions[value] || "Click on a star to rate";
                console.log('Rating set to:', value); // Debug log
            }

            // Function to highlight stars up to a specific value
            function highlightStars(value) {
                stars.forEach(star => {
                    const starValue = parseInt(star.getAttribute('data-value'));
                    if (starValue <= value) {
                        star.classList.add('active');
                        star.classList.add('hover');
                    } else {
                        star.classList.remove('active');
                        star.classList.remove('hover');
                    }
                });
            }

            // Form submission handler
            document.querySelector('.review-form').addEventListener('submit', function(e) {
                if (selectedRating.value === '0') {
                    e.preventDefault();
                    alert('Please select a rating before submitting your review.');
                    return false;
                }
                console.log('Form submitted with rating:', selectedRating.value);
            });
        });
    </script>

</body>

</html>