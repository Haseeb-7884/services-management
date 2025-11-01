<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Package</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #17a2b8 0%, #d946a6 100%);
            --primary-color: #17a2b8;
            --danger-color: #dc3545;
            --bg-light: #f8f9fa;
            --border-color: #dee2e6;
            --text-muted: #6c757d;
        }

        body {
            background-color: var(--bg-light);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        /* Form Container - No border or shadow */
        .form-container {
            background: white;
            padding: 30px;
            margin-bottom: 0;
        }

        /* Section Container */
        .section-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Form Header */
        .form-header {
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .form-header h2 {
            color: var(--primary-color);
            font-weight: 700;
            margin: 0;
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-header p {
            color: var(--text-muted);
            font-size: 1rem;
            margin-top: 8px;
            margin-bottom: 0;
        }

        /* Section Title */
        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Form Labels */
        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }

        /* Input Fields */
        .form-control,
        .form-select {
            border-radius: 6px;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            transition: all 0.3s;
            font-size: 1rem;
        }

        .form-control:focus,
        .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.15);
        }

        .form-text {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-top: 6px;
        }

        /* Feature item styling */
        .feature-item {
            background: #f8f9fa;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            position: relative;
            display: flex;
            align-items: center;
            transition: all 0.3s;
        }

        .feature-item:hover {
            background: #e9ecef;
        }

        .feature-text {
            flex-grow: 1;
            margin-right: 10px;
            font-size: 1rem;
        }

        .feature-remove {
            background: none;
            border: none;
            color: var(--danger-color);
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .feature-remove:hover {
            background: #ffe6e6;
        }

        /* Add more button styling */
        .btn-add-more {
            background: var(--primary-gradient);
            border: none;
            color: white;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
            font-size: 15px;
        }

        .btn-add-more:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
        }

        /* Submit button styling */
        .btn-submit {
            background: var(--primary-gradient);
            border: none;
            color: white;
            padding: 12px 35px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
        }

        /* Cancel button styling */
        .cancel-btn {
            background: white;
            border: 2px solid var(--border-color);
            color: #495057;
            padding: 12px 35px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            margin-right: 15px;
        }

        .cancel-btn:hover {
            border-color: var(--danger-color);
            color: var(--danger-color);
            text-decoration: none;
        }

        /* Auto-generated field styling */
        .auto-field {
            background-color: var(--bg-light);
            color: var(--text-muted);
            font-style: italic;
            padding: 10px 15px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-size: 1rem;
        }

        /* Horizontal layout for large screens */
        @media (min-width: 992px) {
            .horizontal-group {
                display: flex;
                flex-wrap: wrap;
                gap: 25px;
            }

            .horizontal-group>div {
                flex: 1;
                min-width: 250px;
            }
        }

        /* Extra large screens */
        @media (min-width: 1400px) {
            .horizontal-group>div {
                min-width: 300px;
            }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .form-container {
                padding: 20px;
            }

            .section-container {
                padding: 20px;
            }

            .form-header h2 {
                font-size: 1.6rem;
            }

            .form-control,
            .form-select,
            .auto-field {
                padding: 10px 12px;
            }
        }

        /* Icon styling */
        .form-icon {
            color: var(--primary-color);
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }

        .feature-input-group {
            display: flex;
            gap: 10px;
        }

        .feature-input-group input {
            flex: 1;
        }

        @media (max-width: 576px) {
            .feature-input-group {
                flex-direction: column;
            }
        }

        /* Custom container width for large screens */
        .custom-container {
            max-width: 100%;
            padding: 0;
        }

        .toast {
            min-width: 350px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .toast.show {
            display: block;
            opacity: 1;
            transform: translateX(0);
        }

        .toast.hide {
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
        }

        .btn-close {
            opacity: 0.8;
            transition: all 0.2s ease;
        }

        .btn-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        /* Animation for toast entry */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }

            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast {
            animation: slideInRight 0.3s ease-out;
        }

        /* Fixed button container */
        .fixed-button-container {
            padding: 20px 0;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .fixed-button-container {
                padding: 15px 20px;
                flex-direction: column-reverse;
            }

            .btn-submit,
            .cancel-btn {
                width: 100%;
                padding: 12px 20px;
            }
        }
    </style>
</head>

<body>
    <?php
    if (isset($_GET['CurrentStatus'])) {
        $CurrentStatus = $_GET['CurrentStatus'];
        if ($CurrentStatus == 'updated') {
    ?>
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div id="successToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center">
                            <i class="fas fa-check-circle me-2 fs-5"></i>
                            <div>
                                <strong class="me-2">Success!</strong> Package updated successfully.
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

        <?php
        } else if ($CurrentStatus == 'existed') {
        ?>
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div id="successToast" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body d-flex align-items-center">
                            <i class="fas fa-exclamation-triangle me-2 fs-5"></i>
                            <div>
                                <strong class="me-2">Already Exists!</strong> This package name already exists for the selected marketplace.
                            </div>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

    <?php
        }
    }
    ?>
    <div class="container-fluid custom-container py-4">
        <div class="row justify-content-center">
            <div class="col-12">
                <!-- Main form container without border or shadow -->
                <div class="form-container">
                    <!-- Form Header -->
                    <div class="form-header">
                        <h2><i class="fas fa-box"></i>Add New Package</h2>
                        <p>Fill in the details below to create a new package.</p>
                    </div>

                    <!-- Package Form -->
                    <form action="index.php" method="POST" enctype="multipart/form-data">

                        <?php
                        if (isset($_GET['packageID'])) {
                            $packageID = $_GET['packageID'];
                            echo "<input type='hidden' value='$packageID' name='marketplaceID'>";
                        }
                        ?>

                        <!-- First Container: Marketplace Name, Package Name, Prices -->
                        <div class="section-container">
                            <div class="horizontal-group">
                                <!-- Marketplace Name -->
                                <div class="mb-4">
                                    <label for="marketplaceName" class="form-label">
                                        <?php
                                        $packageID;
                                        $Marketplaces = new backend();
                                        $fetchingRecords = $Marketplaces->fetching("marketplaces", "*", null, "id = $packageID");
                                        if (!empty($fetchingRecords)) {
                                            $marketplace = $fetchingRecords[0]['marketplace_name'];
                                        }
                                        ?>                               
                                        <i class="fas fa-tag form-icon"></i>Marketplace Name <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" value="<?= $marketplace ?>" id="marketplaceName" disabled>
                                    <div class="form-text">Your selected marketplace</div>
                                </div>

                                <!-- Package Name -->
                                <div class="mb-4">
                                    <label for="packageName" class="form-label">
                                        <i class="fas fa-tag form-icon"></i>Package Name <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" required class="form-control" name="package_name" id="packageName" placeholder="Enter the package name">
                                    <div class="form-text">Enter the name of the package you want to add.</div>
                                </div>
                            </div>
                            
                            <div class="horizontal-group">
                                <!-- Original Price -->
                                <div class="mb-3">
                                    <label for="originalPrice" class="form-label">
                                        <i class="fas fa-dollar-sign form-icon"></i>Original Price <span class="text-danger">*</span>
                                    </label>
                                    <input type="number" required class="form-control" name="origional_price" id="originalPrice" placeholder="Enter original package price">
                                    <div class="form-text">Enter the actual price of the package.</div>
                                </div>
                                
                                <!-- Discounted Price -->
                                <div class="mb-3">
                                    <label for="discountedPrice" class="form-label">
                                        <i class="fas fa-tag form-icon"></i>Discounted / Old Price (Optional)
                                    </label>
                                    <input type="number" class="form-control" name="old_price" id="discountedPrice" placeholder="Enter old price (if applicable)">
                                    <div class="form-text">If you want to show a discounted price, enter the old price here.</div>
                                </div>
                            </div>
                        </div>

                        <!-- Second Container: Package Features -->
                        <div class="section-container">
                            <div class="section-title">
                                <i class="fas fa-list-ul"></i>Package Features <span class="text-danger">*</span>
                            </div>
                            <div class="feature-input-group mb-3">
                                <input type="text" class="form-control" id="featureInput" placeholder="Enter feature (max 5 words)" maxlength="30">
                                <button class="btn btn-add-more" type="button" id="addFeatureBtn">
                                    <i class="fas fa-plus me-1"></i> Add More
                                </button>
                            </div>
                            <div class="form-text">Add features one by one for this package. Each feature should be short and clear (maximum 5 words).</div>

                            <!-- Features List (initially empty) -->
                            <div id="featuresList" class="mt-3">
                                <!-- Features will be added here dynamically -->
                            </div>

                            <!-- Hidden input to store all features -->
                            <input type="hidden" name="services_features" id="servicesFeatures">
                        </div>

                        <!-- Third Container: Delivery Time and Followers -->
                        <div class="section-container">
                            <div class="horizontal-group">
                                <!-- Delivery Time -->
                                <div class="mb-3">
                                    <label for="deliveryTime" class="form-label">
                                        <i class="fas fa-clock form-icon"></i>Delivery Time (Days) <span class="text-danger">*</span>
                                    </label>
                                    <input required type="number" class="form-control" name="delivery_days" id="deliveryTime" placeholder="Enter number of days">
                                    <div class="form-text">Enter the number of days required to deliver this package.</div>
                                </div>
                                
                                <!-- Followers -->
                                <div class="mb-3">
                                    <label for="followers" class="form-label">
                                        <i class="fas fa-users form-icon"></i>Followers <span class="text-danger">*</span>
                                    </label>
                                    <input required type="number" class="form-control" name="package_followers" id="followers" placeholder="Enter number of followers">
                                    <div class="form-text">Enter how many followers are included in this package.</div>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="fixed-button-container">
                            <a href="#" class="cancel-btn">Return Back</a>
                            <button type="submit" name="add_package" class="btn btn-submit">
                                <i class="fa-solid fa-arrow-right"></i> Procede Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const featureInput = document.getElementById('featureInput');
            const addFeatureBtn = document.getElementById('addFeatureBtn');
            const featuresList = document.getElementById('featuresList');
            const servicesFeaturesInput = document.getElementById('servicesFeatures');
            const packageForm = document.querySelector('form');

            // Add feature functionality
            addFeatureBtn.addEventListener('click', function() {
                addFeature();
            });

            // Also allow adding feature by pressing Enter
            featureInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                }
            });

            // Function to add a new feature
            function addFeature() {
                const featureText = featureInput.value.trim();

                if (featureText === '') {
                    alert('Please enter a feature before adding.');
                    return;
                }

                // Check word count
                const wordCount = featureText.split(/\s+/).length;
                if (wordCount > 5) {
                    alert('Please limit your feature to 5 words maximum.');
                    return;
                }

                // Create feature item
                const featureItem = document.createElement('div');
                featureItem.className = 'feature-item';

                // Feature text
                const featureSpan = document.createElement('span');
                featureSpan.className = 'feature-text';
                featureSpan.textContent = featureText;

                // Hidden input to store this feature
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'features[]';
                hiddenInput.value = featureText;

                // Remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'feature-remove';
                removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                removeBtn.title = 'Remove feature';

                // Add click event to remove button
                removeBtn.addEventListener('click', function() {
                    featuresList.removeChild(featureItem);
                    updateFeaturesHiddenField();
                });

                // Append elements to feature item
                featureItem.appendChild(featureSpan);
                featureItem.appendChild(removeBtn);
                featureItem.appendChild(hiddenInput);

                // Add feature item to features list
                featuresList.appendChild(featureItem);

                // Update the hidden field with all features
                updateFeaturesHiddenField();

                // Clear input
                featureInput.value = '';
                featureInput.focus();
            }

            // Function to update the hidden field with all features separated by ":"
            function updateFeaturesHiddenField() {
                const features = [];
                const featureItems = featuresList.querySelectorAll('.feature-item');

                featureItems.forEach(item => {
                    const featureText = item.querySelector('.feature-text').textContent;
                    features.push(featureText);
                });

                // Join features with ":" separator
                servicesFeaturesInput.value = features.join(':');
            }

            // Update hidden field before form submission
            packageForm.addEventListener('submit', function(e) {
                updateFeaturesHiddenField();

                // Basic validation
                const packageName = document.getElementById('packageName').value.trim();
                const originalPrice = document.getElementById('originalPrice').value.trim();
                const features = servicesFeaturesInput.value;

                if (!packageName) {
                    alert('Please enter a package name.');
                    e.preventDefault();
                    return;
                }

                if (!originalPrice) {
                    alert('Please enter the original price.');
                    e.preventDefault();
                    return;
                }

                if (!features) {
                    alert('Please add at least one feature.');
                    e.preventDefault();
                    return;
                }
            });
        });

        function showSuccessToast() {
            const toastEl = document.getElementById('successToast');
            const toast = new bootstrap.Toast(toastEl, {
                autohide: true,
                delay: 5000
            });
            toast.show();
        }

        // Auto-show toast if it exists on page load
        document.addEventListener('DOMContentLoaded', function() {
            const toastEl = document.getElementById('successToast');
            if (toastEl) {
                showSuccessToast();
            }
        });

        // Manual close functionality (additional to Bootstrap's built-in)
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-bs-dismiss="toast"]')) {
                const toastEl = e.target.closest('.toast');
                const toast = bootstrap.Toast.getInstance(toastEl);
                if (toast) {
                    toast.hide();
                }
            }
        });
    </script>
</body>

</html>