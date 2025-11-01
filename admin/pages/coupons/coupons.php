<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <!-- SweatAlert CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.12.3/sweetalert2.min.css" integrity="sha512-WxRv0maH8aN6vNOcgNFlimjOhKp+CUqqNougXbz0E+D24gP5i+7W/gcc5tenxVmr28rH85XHF5eXehpV2TQhRg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- FontAwsome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <title>Create Coupon - DigiScale</title>

    <style>
        .error_main_continer {
            height: 50px;
            width: 1120px;
            border: 2px solid darkred;
            border-radius: 5px;
        }

        .error_container_fluid {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            width: 100%;
        }

        .error_container_fluid>i {
            width: 6%;
            height: 100%;
            font-size: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: darkred;
            font-weight: bold;
        }

        .error_container_fluid>section {
            width: 93%;
            height: 100%;
            color: darkred;
            font-weight: bold;
            padding: 10px 5px 5px 10px;
            font-size: 16.5px;
        }

        /* Improved UI Styling */
        .form-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            border: 1px solid #e9ecef;
        }

        .section-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #3498db;
        }

        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95rem;
        }

        .form-control,
        .form-select {
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            background: #fff;
            height: 42px;
        }

        .form-control:focus,
        .form-select:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
            background: #fff;
        }

        .form-control::placeholder {
            color: #6c757d;
            font-weight: 400;
            font-size: 0.9rem;
        }

        /* Improved Button Sizes */
        .btn-primary {
            background: linear-gradient(135deg, #3498db, #2980b9);
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
            height: 42px;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #2980b9, #3498db);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .btn-sm-custom {
            padding: 8px 16px;
            font-size: 0.85rem;
            height: 38px;
        }

        .required-star {
            color: #e74c3c;
            font-weight: 700;
        }

        .info-text {
            color: #7f8c8d;
            font-size: 0.8rem;
            margin-top: 6px;
            font-style: italic;
            line-height: 1.3;
        }

        .marketplace-display {
            background: #e8f4fc;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
        }

        .marketplace-display h6 {
            color: #2c3e50;
            font-weight: 600;
            margin: 0;
            font-size: 0.95rem;
        }

        .nav-pills .nav-link {
            border-radius: 8px;
            padding: 10px 16px;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .nav-pills .nav-link.active {
            background: linear-gradient(135deg, #3498db, #2980b9);
            border-color: #3498db;
            color: white;
        }

        .nav-pills .nav-link:not(.active):hover {
            border-color: #3498db;
            background: #f8f9fa;
        }

        .loading-spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 6px;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .select-wrapper {
            position: relative;
        }

        .select-loader {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            display: none;
        }

        /* Improved Card-like styling */
        .form-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
            border: 1px solid #e9ecef;
            margin-bottom: 16px;
        }

        /* Improved Spacing and Layout */
        .mb-3-custom {
            margin-bottom: 16px !important;
        }

        .mb-4-custom {
            margin-bottom: 20px !important;
        }

        .form-group {
            margin-bottom: 18px;
        }

        .input-group-custom {
            margin-bottom: 18px;
        }

        /* Consistent field widths */
        .field-width-md {
            width: 320px;
        }

        .field-width-sm {
            width: 200px;
        }

        /* Improved alignment */
        .align-items-center {
            align-items: center !important;
        }

        .justify-content-between {
            justify-content: space-between !important;
        }

        /* Better responsive behavior */
        @media (max-width: 768px) {
            .field-width-md {
                width: 100%;
            }

            .field-width-sm {
                width: 100%;
            }

            .form-card {
                padding: 15px;
            }
        }
    </style>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script>
        $(document).ready(function() {
            let marketplacesLoaded = false;

            // Cache selectors for better performance
            const $marketplaceSelect = $('#marketplace_select');
            const $packageSelect = $('#package_select');
            const $marketplaceLoader = $('#marketplace_loader');
            const $packageLoader = $('#package_loader');

            // Load marketplaces only once on page load
            if (!marketplacesLoaded) {
                loadMarketplaces();
                marketplacesLoaded = true;
            }

            // Handle marketplace change event
            $marketplaceSelect.on('change', function() {
                const marketplaceId = $(this).val();
                if (marketplaceId) {
                    loadPackages(marketplaceId);
                } else {
                    resetPackageSelect();
                }
            });

            // Function to load marketplaces
            function loadMarketplaces() {
                showLoader($marketplaceLoader);
                $marketplaceSelect.prop('disabled', true);

                $.ajax({
                    type: 'POST',
                    url: 'ajax_handler.php',
                    data: {
                        action: 'get_marketplaces'
                    },
                    beforeSend: function() {
                        $marketplaceSelect.html('<option value="" selected disabled>Loading marketplaces...</option>');
                    },
                    success: function(data) {
                        setTimeout(() => {
                            $marketplaceSelect.html(data).addClass('fade-in');
                            hideLoader($marketplaceLoader);
                            $marketplaceSelect.prop('disabled', false);

                            setTimeout(() => {
                                $marketplaceSelect.removeClass('fade-in');
                            }, 300);
                        }, 200);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error loading marketplaces:', error);
                        setTimeout(() => {
                            $marketplaceSelect.html('<option value="" selected disabled>Error loading marketplaces</option>');
                            hideLoader($marketplaceLoader);
                            $marketplaceSelect.prop('disabled', false);
                        }, 200);
                    }
                });
            }

            // Function to load packages
            function loadPackages(marketplaceId) {
                showLoader($packageLoader);
                $packageSelect.prop('disabled', true);

                $.ajax({
                    type: 'POST',
                    url: 'ajax_handler.php',
                    data: {
                        action: 'get_packages',
                        marketplace_id: marketplaceId
                    },
                    beforeSend: function() {
                        $packageSelect.html('<option value="" selected disabled>Loading packages...</option>');
                    },
                    success: function(data) {
                        setTimeout(() => {
                            $packageSelect.html(data).addClass('fade-in');
                            hideLoader($packageLoader);
                            $packageSelect.prop('disabled', false);

                            setTimeout(() => {
                                $packageSelect.removeClass('fade-in');
                            }, 300);
                        }, 200);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error loading packages:', error);
                        setTimeout(() => {
                            $packageSelect.html('<option value="" selected disabled>Error loading packages</option>');
                            hideLoader($packageLoader);
                            $packageSelect.prop('disabled', false);
                        }, 200);
                    }
                });
            }

            // Reset package select
            function resetPackageSelect() {
                $packageSelect.html('<option value="" selected disabled>Please select marketplace first</option>')
                    .prop('disabled', true)
                    .addClass('fade-in');

                setTimeout(() => {
                    $packageSelect.removeClass('fade-in');
                }, 300);
            }

            // Show/hide loader functions
            function showLoader(loaderElement) {
                loaderElement.fadeIn(200);
            }

            function hideLoader(loaderElement) {
                loaderElement.fadeOut(200);
            }

            // Your existing coupon generation code with smooth UX
            $('#generate_coupon').on('click', function() {
                const $button = $(this);
                const originalText = $button.html();

                $button.prop('disabled', true).html('<span class="loading-spinner"></span>Generating...');

                $.ajax({
                    type: 'POST',
                    url: 'generate_coupon.php',
                    success: function(data) {
                        setTimeout(() => {
                            $('#coupon').val(data).addClass('fade-in');
                            $button.prop('disabled', false).html(originalText);

                            setTimeout(() => {
                                $('#coupon').removeClass('fade-in');
                            }, 300);
                        }, 300);
                    },
                    error: function() {
                        setTimeout(() => {
                            $button.prop('disabled', false).html(originalText);
                            Swal.fire('Error', 'Failed to generate coupon', 'error');
                        }, 300);
                    }
                });
            });

            // Add hover effects for better UX
            $('select, input').on('focus', function() {
                $(this).css('border-color', '#3498db');
            }).on('blur', function() {
                $(this).css('border-color', '#e9ecef');
            });
        });
    </script>
</head>

<body>

    <?php
    if (isset($_GET['sending'])) {
        $sending = $_GET['sending'];
    ?>
        <div class="error_main_continer fade-in">
            <div class="error_container_fluid">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <section>
                    It seems that you have tried to submit form without entering mendatory entities.
                    Please fill all the required information to proceed.
                </section>
            </div>
        </div>
    <?php
    }
    ?>

    <div class="container mt-4" style="width:90%;">
        <form id="myForm" method="post" action="coupon_data.php">

            <div class="form-card">
                <h3 class="section-title">Create New Coupon</h3>
                <p class="info-text mb-4-custom">Fill in the details below to create a new coupon for your packages.</p>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="coupon" class="form-label">Coupon Code <span class="required-star">*</span></label>
                            <div class="d-flex align-items-center gap-3">
                                <input type="text" required class="form-control field-width-md" id="coupon" name="coupon" placeholder="Enter coupon code">
                                <button type="button" class="btn btn-primary btn-sm-custom" id="generate_coupon">
                                    <i class="fas fa-bolt me-1"></i>Generate
                                </button>
                            </div>
                            <div class="info-text">Create or enter a unique coupon code</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Discount Percentage <span class="required-star">*</span></label>
                            <input type="number" required class="form-control field-width-md" placeholder="Enter discount percentage e.g. 10" name="coupon_percent">
                            <div class="info-text">Enter the discount percentage for this coupon</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex align-items-start mt-4 gap-4">
                <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical" style="min-width: 180px;">
                    <button class="nav-link active mb-2" id="v-pills-general-tab" data-bs-toggle="pill" data-bs-target="#v-pills-general"
                        type="button" role="tab" aria-controls="v-pills-general" aria-selected="true">
                        <i class="fas fa-cog me-2"></i>General
                    </button>

                    <button class="nav-link mb-2" id="v-pills-tools-tab" data-bs-toggle="pill" data-bs-target="#v-pills-tools"
                        type="button" role="tab" aria-controls="v-pills-tools" aria-selected="false">
                        <i class="fas fa-chart-bar me-2"></i>Usage Limits
                    </button>
                </div>

                <div class="tab-content flex-grow-1" id="v-pills-tabContent">
                    <div class="tab-pane fade show active" id="v-pills-general" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <div class="form-card">
                            <h5 class="section-title">Coupon Configuration</h5>

                            <!-- Marketplace Dropdown -->
                            <div class="form-group">
                                <label class="form-label">Select Marketplace <span class="required-star">*</span></label>
                                <div class="select-wrapper">
                                    <select class="form-select field-width-md" name="marketplace_id" id="marketplace_select" aria-label="Select Marketplace" required>
                                        <option value="" selected disabled>Select Marketplace</option>
                                    </select>
                                    <div class="select-loader" id="marketplace_loader">
                                        <span class="loading-spinner"></span>
                                    </div>
                                </div>
                                <div class="info-text">Choose the marketplace for this coupon</div>
                            </div>

                            <!-- Package Dropdown -->
                            <div class="form-group">
                                <label class="form-label">Select Package <span class="required-star">*</span></label>
                                <div class="select-wrapper">
                                    <select class="form-select field-width-md" name="marketplace_services_id" id="package_select" aria-label="Select Package" required disabled>
                                        <option value="" selected disabled>Please select marketplace first</option>
                                    </select>
                                    <div class="select-loader" id="package_loader">
                                        <span class="loading-spinner"></span>
                                    </div>
                                </div>
                                <div class="info-text">Select the package associated with the marketplace</div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Discount Type <span class="required-star">*</span></label>
                                        <select class="form-select field-width-sm" name="cou_percentage" aria-label="Discount Type">
                                            <option selected required value="%">Percentage (%)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Coupon Quantity <span class="required-star">*</span></label>
                                        <input type="text" class="form-control field-width-sm" required name="coupons_quantity" placeholder="Enter quantity">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Coupon Expiry Date <span class="required-star">*</span></label>
                                <input type="datetime-local" name="coupon_expiry" required class="form-control field-width-md">
                                <div class="info-text">Set the expiration date and time for this coupon</div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="v-pills-tools" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                        <div class="form-card">
                            <h5 class="section-title">Usage Limits & Restrictions</h5>

                            <div class="form-group">
                                <label class="form-label">Usage Limit per Coupon</label>
                                <input type="text" class="form-control field-width-md" name="coupons_usage_limit" placeholder="Unlimited usage">
                                <div class="info-text">Maximum number of times this coupon can be used</div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Usage Limit per User</label>
                                <input type="number" class="form-control field-width-md" readonly placeholder="Unlimited usage" value="1">
                                <div class="info-text" style="color: #e74c3c;">
                                    To increase limit please contact Website Admin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-start mt-4">
                <button type="submit" class="btn btn-primary" name="coupon_submit">
                    <i class="fas fa-paper-plane me-2"></i>Create Coupon
                </button>
            </div>

        </form>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.12.3/sweetalert2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>