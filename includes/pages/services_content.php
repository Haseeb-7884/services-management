<?php
include("../connection.php");
$FetchObj = new backend();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Meta tags for responsiveness and character encoding -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post Monthly Package - InstaPro</title>

    <!-- Bootstrap CSS CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <!-- Custom CSS Link -->
    <link rel="stylesheet" href="../../assets/css/services_content.css">

    <!-- Star Rating CSS -->
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

    <!-- Your existing toast and PHP code remains the same -->
    <?php
    if (isset($_GET['status'])) {
        $status = $_GET['status'];
        if ($status == 'success') {
    ?>
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div id="successToast" class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center">
                            <i class="fas fa-check-circle me-2 fs-5"></i>
                            <div>
                                <strong class="me-2">Success!</strong> Your suggestion has been submitted successfully.
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="hideToast()" aria-label="Close"></button>
                    </div>
                </div>
            </div>
    <?php
        }
    }
    ?>

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        <div id="successToast" class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="fas fa-check-circle me-2 fs-5"></i>
                    <div>
                        <strong class="me-2">Awesome!</strong> Your review has been submitted successfully.
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="hideToast()" aria-label="Close"></button>
            </div>
        </div>
    </div>

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        <div id="successToast" class="toast align-items-center text-bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center">
                    <i class="fas fa-triangle-exclamation me-2 fs-5"></i>
                    <div>
                        <strong class="me-2">Authentication Required!</strong> Please log in to submit a review.
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="hideToast()" aria-label="Close"></button>
            </div>
        </div>
    </div>

    <?php
    if (isset($_GET['PackageID']) || isset($_GET['marketplaceID'])) {
        $packageID = $_GET['PackageID'];
        $marketplaceID = $_GET['marketplaceID'];
        $getPakcages = $FetchObj->fetching("marketplace_services", "*", null, "id = $packageID");
        if (!empty($getPakcages)) {
            $package_name = $getPakcages[0]['package_name'];
            $price_origional = $getPakcages[0]['price_origional'];
        }
        $getmarketplace = $FetchObj->fetching("marketplaces", "*", null, "id = $marketplaceID");
        if (!empty($getmarketplace)) {
            $marketplace_name = $getmarketplace[0]['marketplace_name'];
        }
    } else {
        echo "null";
    }
    ?>

    <div class="page-header">
        <h1># <?= $package_name ?></h1>
        <p>Influencers Growth Services > <?= $marketplace_name ?> > # <?= $package_name ?></p>
    </div>

    <!-- ===== MAIN PRODUCT SECTION ===== -->
    <div class="product-container">
        <!-- Your existing product section remains the same -->
        <div class="row">
            <!-- ===== LEFT COLUMN: PRODUCT IMAGE ===== -->
            <div class="col-lg-5 col-md-6 mb-4">
                <div class="product-image-section">
                    <!-- Image wrapper with magnify effect -->
                    <div class="product-image-wrapper" id="imageWrapper">
                        <!-- Product image (can be changed) -->
                        <img id="productImage"
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23ff1493' width='300' height='300'/%3E%3Ctext x='50%25' y='30%25' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle'%3E📱%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='30' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3EPOSTS%3C/text%3E%3Ctext x='50%25' y='70%25' font-size='30' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3EMONTHLY PACKAGE%3C/text%3E%3Ctext x='50%25' y='85%25' font-size='50' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3E1000%3C/text%3E%3C/svg%3E"
                            alt="Post Monthly Package">
                    </div>
                </div>
            </div>

            <!-- ===== RIGHT COLUMN: PRODUCT DETAILS ===== -->
            <div class="col-lg-7 col-md-6">
                <!-- Product details card -->
                <div class="product-details">
                    <!-- Rating section -->
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span class="rating-count">(2 customer reviews)</span>
                    </div>

                    <!-- Product title -->
                    <h2 class="product-title"># <?= $package_name ?></h2>

                    <!-- Product description -->
                    <p class="product-description">+1000 post Reach and impressions / Month</p>

                    <!-- Product price -->
                    <div class="product-price">$<?= $price_origional ?></div>

                    <!-- Features list -->
                    <div class="features-list">
                        <?php
                        $fetchingServicesDetails = $FetchObj->fetching("services_details", "*", null, "services_id = $packageID");
                        if (!empty($fetchingServicesDetails)) {
                            foreach ($fetchingServicesDetails as $features) {
                                $desription_question = $features['desription_question'];
                                $description = $features['description'];
                                $services_question = $features['services_question'];
                                $services = $features['services'];
                                $services_id = $features['services_id'];
                                $marketplace_id = $features['marketplace_id'];

                                // Split questions and descriptions by | separator
                                $questionsArray = explode('|', $services_question);
                                $descriptionsArray = explode('|', $services);

                                // Loop through questions and display each with its corresponding description
                                foreach ($questionsArray as $index => $question) {
                                    $desc = isset($descriptionsArray[$index]) ? $descriptionsArray[$index] : '';
                                    // Clean up the description (remove HTML entities if needed)
                                    $desc = html_entity_decode($desc);
                        ?>
                                    <!-- Dynamic Feature Item -->
                                    <div class="feature-item">
                                        <div class="feature-icon">
                                            <i class="fa-solid fa-star"></i>
                                        </div>
                                        <div class="feature-text">
                                            <h5><?php echo htmlspecialchars(trim($question)); ?></h5>
                                            <p><?php echo trim($desc); ?></p>
                                        </div>
                                    </div>
                        <?php
                                }
                            }
                        }
                        ?>

                    </div>

                    <!-- Product controls (quantity selector and add to cart) -->
                    <div class="product-controls">
                        <!-- Quantity selector -->
                        <div class="quantity-selector">
                            <a class="quantity-btn text-decoration-none" id="decreaseBtn">
                                <i class="fas fa-minus"></i>
                            </a>
                            <input type="text" class="quantity-input" id="quantityInput" value="1" min="1">
                            <a class="quantity-btn text-decoration-none" id="increaseBtn">
                                <i class="fas fa-plus"></i>
                            </a>
                        </div>
                        <!-- Add to cart button -->
                        <button class="btn-add-to-cart" onclick="addToCart()">
                            <i class="fas fa-shopping-cart"></i> Add to cart
                        </button>
                    </div>

                    <!-- Share section -->
                    <div class="share-section">
                        <span class="share-label">Share:</span>
                        <button class="share-btn" onclick="shareOnFacebook()">
                            <i class="fab fa-facebook"></i> Share on Facebook
                        </button>
                        <button class="share-btn" onclick="shareOnTwitter()">
                            <i class="fab fa-twitter"></i> Share on X
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== TABS SECTION: DESCRIPTION AND REVIEWS ===== -->
        <div class="tabs-section">
            <!-- Tab navigation -->
            <ul class="nav nav-tabs" id="productTabs" role="tablist">
                <!-- Description tab -->
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="description-tab" data-bs-toggle="tab"
                        data-bs-target="#description" type="button" role="tab" aria-controls="description"
                        aria-selected="true">
                        Description
                    </button>
                </li>
                <!-- Reviews tab -->
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews"
                        type="button" role="tab" aria-controls="reviews" aria-selected="false">
                        Reviews (2)
                    </button>
                </li>
            </ul>

            <!-- Tab content -->
            <div class="tab-content" id="productTabsContent">
                <!-- ===== DESCRIPTION TAB ===== -->
                <div class="tab-pane fade show active" id="description" role="tabpanel"
                    aria-labelledby="description-tab">

                    <div class="description-section">
                        <!-- Why Should You Buy Instagram Impressions -->
                        <?php
                        $fetchingServicesDetails = $FetchObj->fetching("services_details", "*", null, "services_id = $packageID");
                        if (!empty($fetchingServicesDetails)) {
                            foreach ($fetchingServicesDetails as $features) {
                                $desription_question = $features['desription_question'];
                                $description = $features['description'];

                                // Split description questions and descriptions by | separator
                                $descQuestionsArray = explode('|', $desription_question);
                                $descAnswersArray = explode('|', $description);

                                // Loop through description questions and display each with its corresponding description
                                foreach ($descQuestionsArray as $index => $descQuestion) {
                                    $descAnswer = isset($descAnswersArray[$index]) ? $descAnswersArray[$index] : '';
                                    // Clean up the description answer (remove HTML entities if needed)
                                    $descAnswer = html_entity_decode($descAnswer);
                        ?>
                                    <!-- Dynamic Description Item -->
                                    <h3 class="mt-0">✓ <?php echo htmlspecialchars(trim($descQuestion)); ?></h3>
                                    <p><?php echo trim($descAnswer); ?></p>
                            <?php
                                }
                            }
                        } else {
                            ?>
                            <p><span class="fw-bold text-danger">Alert!</span> Description is not Provided by Admin</p>
                        <?php
                        }
                        ?>

                    </div>

                </div>

                <!-- ===== REVIEWS TAB ===== -->
                <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                    <div class="reviews-section">
                        <!-- Review 1 -->

                        <div class="review-card">
                            <div class="reviewer-info">
                                <div class="reviewer-avatar">D</div>
                                <div class="reviewer-details">
                                    <div class="reviewer-name">Donald</div>
                                    <div class="review-date">June 22, 2024</div>
                                </div>
                            </div>
                            <div class="review-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <p class="review-text">The $35 Post Monthly Package is excellent! I get 1000 post reach and
                                impressions every month. Fast delivery and permanent results with no risk of decrease.
                                Trust the 24/7 support is very helpful.</p>
                        </div>

                    </div>

                    <!-- Add Review Form -->
                    <form class="review-form" method="POST" action="review_manage.php">
                        <h4>Add a review</h4>
                        <p style="color: #90a4ae; margin-bottom: 20px;">Your email address will not be published.</p>

                        <!-- Name field -->
                        <div class="form-group">
                            <label for="reviewName">Name *</label>
                            <input type="text" class="form-control" id="reviewName" placeholder="Your name" required>
                        </div>

                        <!-- Email field -->
                        <div class="form-group">
                            <label for="reviewEmail">Email *</label>
                            <input type="email" required class="form-control" id="reviewEmail" placeholder="your@email.com">
                        </div>

                        <!-- Star rating -->
                        <div class="form-group">
                            <label>Your Rating *</label>
                            <div class="star-rating" id="starRating">
                                <i class="fas fa-star" data-value="1"></i>
                                <i class="fas fa-star" data-value="2"></i>
                                <i class="fas fa-star" data-value="3"></i>
                                <i class="fas fa-star" data-value="4"></i>
                                <i class="fas fa-star" data-value="5"></i>
                            </div>
                            <div class="rating-text" id="ratingText">Click on a star to rate</div>
                            <input type="hidden" id="selectedRating" name="rating" value="0" required>
                        </div>

                        <!-- Review text -->
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label for="reviewText">Your Review *</label>
                            <textarea class="form-control" name="review_text" id="reviewText" rows="5" placeholder="Write your review"
                                required></textarea>
                        </div>

                        <input type="hidden" value="<?= $packageID ?>" name="packageID">

                        <!-- Submit button -->
                        <input type="submit" class="btn-submit" value="reviewSubmit">
                    </form>
                </div>
            </div>
        </div>

        <!-- Your existing related products and client suggestions sections remain the same -->
        <!-- ===== RELATED PRODUCTS ===== -->
        <div class="related-products">
            <h3>Related Products</h3>
            <div class="row">
                <!-- Product Card 1 -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="product-card">
                        <div class="product-card-image">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="product-card-content">
                            <h5 class="product-card-title">Buy 3000 Real Views - ELITE Package</h5>
                            <div class="product-card-price">$45</div>
                        </div>
                    </div>
                </div>

                <!-- Product Card 2 -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="product-card">
                        <div class="product-card-image">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="product-card-content">
                            <h5 class="product-card-title">Buy 2000 Instagram Followers, Real and Instant - Silver...
                            </h5>
                            <div class="product-card-price">$65</div>
                        </div>
                    </div>
                </div>

                <!-- Product Card 3 -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="product-card">
                        <div class="product-card-image">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="product-card-content">
                            <h5 class="product-card-title">Buy Real Instagram Followers, Likes, And Views - Ultimate...
                            </h5>
                            <div class="product-card-price">$199</div>
                        </div>
                    </div>
                </div>

                <!-- Product Card 4 -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div class="product-card">
                        <div class="product-card-image">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="product-card-content">
                            <h5 class="product-card-title">Buy 5000 Likes, 1000 Views, 500 Real Active Instagram...</h5>
                            <div class="product-card-price">$299</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== SHARE YOUR THOUGHTS SECTION ===== -->
    <div
        style="background: rgba(255, 255, 255, 0.03); border-top: 1px solid rgba(0, 188, 212, 0.2); padding: 60px 20px; text-align: center; margin-top: 60px;">
        <h3 style="color: #ffffff; margin-bottom: 15px; font-weight: 700;">Share Your Thoughts</h3>
        <p style="color: #b0bec5;">We value your feedback! Help us improve your experience by sharing your thoughts on
            our website's services and tools in the "Submit Review" section.</p>
    </div>

    <!-- Client Suggestions Section -->
    <section class="cs-suggestions-wrapper">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-10 col-xl-9">
                    <!-- Main Card Container -->
                    <div class="cs-card">
                        <!-- Header Section -->
                        <div class="cs-header">
                            <h2 class="cs-title">Client Suggestions</h2>
                            <p class="cs-subtitle">Share your ideas to improve this package.</p>
                        </div>

                        <!-- Form Section -->
                        <form class="cs-form" action="support.php" method="POST" id="clientSuggestionsForm">
                            <!-- Row for Name and Category -->
                            <div class="row g-3 g-md-4">
                                <!-- Your Name Field -->
                                <div class="col-12 col-md-6">
                                    <label for="csYourName" class="cs-label">
                                        Your Name <span class="cs-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        class="cs-input"
                                        id="csYourName"
                                        placeholder="Enter your name"
                                        name="customer_name"
                                        required>
                                </div>

                                <!-- Category Dropdown -->
                                <div class="col-12 col-md-6">
                                    <label for="csCategory" class="cs-label">
                                        Category <span class="cs-required">*</span>
                                    </label>
                                    <select name="select_category" class="cs-select" id="csCategory" required>
                                        <option value="Feature Request" selected>Feature Request</option>
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="Improvement">Improvement</option>
                                        <option value="General Feedback">General Feedback</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Suggestion Title Field -->
                            <div class="cs-form-group">
                                <label for="csSuggestionTitle" class="cs-label">
                                    Suggestion Title <span class="cs-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    class="cs-input"
                                    id="csSuggestionTitle"
                                    placeholder="Brief title for your suggestion"
                                    name="suggestion_title"
                                    required>
                            </div>

                            <!-- Your Suggestion Textarea -->
                            <div class="cs-form-group">
                                <label for="csYourSuggestion" class="cs-label">
                                    Your Suggestion <span class="cs-required">*</span>
                                </label>
                                <textarea
                                    class="cs-textarea"
                                    id="csYourSuggestion"
                                    rows="6"
                                    placeholder="Describe your suggestion in detail..."
                                    name="suggestion_description"
                                    required></textarea>
                            </div>

                            <input type="hidden" value="<?= $marketplaceID ?>" name="marketplaceID">
                            <input type="hidden" value="<?= $packageID ?>" name="packageID">

                            <!-- Submit Button -->
                            <div class="cs-button-wrapper">

                                <button type="submit" class="cs-submit-btn" name="suggestion_submit">
                                    <svg class="cs-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                    Submit
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Bootstrap JS CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

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

        // ===== QUANTITY SELECTOR FUNCTIONALITY =====
        // Get quantity input and buttons
        const quantityInput = document.getElementById('quantityInput');
        const increaseBtn = document.getElementById('increaseBtn');
        const decreaseBtn = document.getElementById('decreaseBtn');

        // Increase quantity
        increaseBtn.addEventListener('click', function() {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });

        // Decrease quantity (minimum 1)
        decreaseBtn.addEventListener('click', function() {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });

        // ===== IMAGE UPLOAD FUNCTIONALITY =====
        // Get image input and wrapper
        const imageInput = document.getElementById('imageInput');
        const productImage = document.getElementById('productImage');

        // Handle image upload
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Create file reader to display image
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Update product image with uploaded image
                    productImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // ===== CART FUNCTIONALITY =====
        // Add to cart function
        function addToCart() {
            const quantity = quantityInput.value;
            const packageID = '<?= $packageID ?>';
            const marketplaceID = '<?= $marketplaceID ?>';

            // Create professional toast notification at top
            const toastHTML = `
        <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 9999; width: 100%; max-width: 500px;">
            <div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center flex-grow-1">
                        <i class="fas fa-check-circle me-3 fs-4"></i>
                        <div class="flex-grow-1">
                            <div class="fw-bold">Awesome! ${quantity} item(s) added to your shopping cart</div>
                            <div class="small">Taking you to cart details now...</div>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    `;

            // Add toast to body
            document.body.insertAdjacentHTML('beforeend', toastHTML);

            // Redirect after 2 seconds
            setTimeout(function() {
                window.location.href = `cart_handle.php?packageID=${packageID}&marketplaceID=${marketplaceID}&cartQuantity=${quantity}`;
            }, 2000);
        }

        // ===== SHARE FUNCTIONALITY =====
        // Share on Facebook
        function shareOnFacebook() {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        }

        // Share on Twitter/X
        function shareOnTwitter() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this amazing Instagram Package!');
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        }

        // Client Suggestions Form Handler
        document.getElementById('clientSuggestionsForm')?.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const formData = {
                name: document.getElementById('csYourName').value,
                category: document.getElementById('csCategory').value,
                title: document.getElementById('csSuggestionTitle').value,
                suggestion: document.getElementById('csYourSuggestion').value
            };

            // Here you can add your form submission logic
            console.log('Form submitted:', formData);

            // Example: Show success message
            alert('Thank you for your suggestion! We appreciate your feedback.');

            // Reset form
            this.reset();
        });

        // toasts
        setTimeout(function() {
            const toast = document.getElementById('successToast');
            if (toast) {
                toast.remove();
            }
        }, 5000);

        function hideToast() {
            const toast = document.getElementById('successToast');
            if (toast) {
                toast.classList.remove('show');
                // Remove from DOM after animation
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }
        }

        // Also allow manual close
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-close')) {
                hideToast();
            }
        });
    </script>

</body>

</html>