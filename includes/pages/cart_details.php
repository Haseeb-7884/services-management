<?php
include("../connection.php");
if (isset($_SESSION['id'])) {
    $logerID = $_SESSION['id'];
    if (isset($_GET['cartQuantity'])) {
        $cartQuantity = $_GET['cartQuantity'];
        $marketplaceID = $_GET['marketplaceID'];
        $packageID = $_GET['packageID'];
    }

    $Fetchobj = new backend();

?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopping Cart - SocialGrowth</title>

        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Font Awesome for Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet">

        <!-- Custom CSS -->
        <link rel="stylesheet" href="../../assets/css/cart_details.css">

    </head>

    <body>

        <?php
        if (isset($_GET['code'])) {
            $code = $_GET['code'];
            if ($code == "cartID_deleted") {
        ?>
                <div class="toast-container" id="toastContainer">
                    <div class="toast align-items-center text-bg-success border-0 show" id="successToast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body d-flex align-items-center flex-grow-1">
                                <i class="fas fa-check-circle me-3 fs-4"></i>
                                <div class="flex-grow-1">
                                    <div class="fw-bold">Item Removed</div>
                                    <div class="small">The item has been successfully removed from your cart.</div>
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


        <!-- ==================== Hero Section ==================== -->
        <section class="hero-section">
            <div class="hero-bg"></div>
            <div class="container">
                <h1>
                    <i class="fas fa-shopping-cart"></i>
                    Shopping Cart
                </h1>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="../../index.php">Home</a></li>
                        <li class="breadcrumb-item active">Cart</li>
                    </ol>
                </nav>
            </div>
        </section>

        <!-- ==================== Main Cart Content ==================== -->
        <div class="container">
            <div class="row">
                <!-- Left Column - Cart Items -->
                <div class="col-lg-8">
                    <!-- Cart Table Section -->
                    <div class="cart-section">
                        <!-- Table Header -->
                        <div class="cart-table-header">
                            <div>PRODUCT</div>
                            <div>PRICE</div>
                            <div>QUANTITY</div>
                            <?php
                            if (isset($_GET['code'])) {
                                if ($_GET['code'] == "coupon_applied") {
                            ?>
                                    <div>SUBTOTAL (Discounted)</div>
                            <?php
                                } else {
                                    echo "<div>SUBTOTAL</div>";
                                }
                            } else {
                                echo "<div>SUBTOTAL</div>";
                            }
                            ?>
                        </div>

                        <?php
                        $getcart = $Fetchobj->fetching("cart", "*", null, "user_id = $logerID");
                        if (!empty($getcart)) {
                            foreach ($getcart as $cartItems) {
                                $items_qty = $cartItems['items_qty'];
                                $marketplace_id = $cartItems['marketplace_id'];
                                $marketplace_services_id = $cartItems['marketplace_services_id'];
                                $cart_id = $cartItems['id'];

                                $marketplace_services = $Fetchobj->fetching("marketplace_services", "*", null, "id = $marketplace_services_id");
                                if (!empty($marketplace_services)) {
                                    foreach ($marketplace_services as $packages) {
                                        $package_name = $packages['package_name'];
                                        $price_origional = $packages['price_origional'];
                                        $subtotal = $price_origional * $items_qty;
                        ?>
                                        <div class="cart-item" data-cart-id="<?= $cart_id ?>">
                                            <!-- Product Row -->
                                            <div class="cart-item-row">
                                                <div class="product-info">
                                                    <a class="remove-btn" href="cart_manage.php?remove=<?= $cart_id ?>">
                                                        <i class="fas fa-trash"></i>
                                                    </a>
                                                    <div class="product-image">
                                                        <?php
                                                        $marketplace = $Fetchobj->fetching("marketplaces", "*", null, "id = $marketplace_id");
                                                        if (!empty($marketplace)) {
                                                            $marketplace_name = $marketplace[0]['marketplace_name'];
                                                            if ($marketplace_name == "Instagram") {
                                                                echo "<i class='fab fa-instagram' style='font-size: 2.5rem; color: #e4405f;'></i>";
                                                            } elseif ($marketplace_name == "TikTok") {
                                                                echo "<i class='fab fa-tiktok' style='font-size: 2.5rem; color: #fff;'></i>";
                                                            } elseif ($marketplace_name == "Facebook") {
                                                                echo "<i class='fab fa-facebook' style='font-size: 2.5rem; color: #1877F2;'></i>";
                                                            } elseif ($marketplace_name == "Youtube") {
                                                                echo "<i class='fab fa-youtube' style='font-size: 2.5rem; color: #FF0000;'></i>";
                                                            } elseif ($marketplace_name == "Twitter") {
                                                                echo "<i class='fab fa-x-twitter' style='font-size: 2.5rem; color: #000000;'></i>";
                                                            }
                                                        }
                                                        ?>
                                                    </div>
                                                    <div class="product-details">
                                                        <h5><?= $package_name ?></h5>
                                                        <?php
                                                        if (isset($_GET['code'])) {
                                                            $code = $_GET['code'];
                                                            if ($code == 'coupon_applied') {
                                                                $couponID = $_GET['couponID'];
                                                                $getCouponDiscount = new backend();
                                                                $GetData = $getCouponDiscount->fetching("coupons", "*", null, "id = $couponID");
                                                                if (!empty($GetData)) {
                                                                    $coupon = $GetData[0]['coupon'];
                                                        ?>
                                                                    <p>Coupon Applied</p>
                                                                    <p><?= $coupon ?></p>
                                                        <?php
                                                                }
                                                            }
                                                        } else {
                                                            echo null;
                                                        }
                                                        ?>
                                                    </div>
                                                </div>

                                                <div class='price'><?= $price_origional ?></div>

                                                <div class="quantity-controls">
                                                    <?php
                                                    if ($items_qty <= 1) {
                                                        echo "<div class='qty-btn minus-btn text-decoration-none' style='pointer-events: none; opacity: 0.6; cursor: not-allowed;'>-</div>";
                                                    } else {
                                                    ?>
                                                        <a class='qty-btn minus-btn text-decoration-none' href='cart_manage.php?cartVal=decrease&packageID=<?= $marketplace_services_id ?>&marketplaceID=<?= $marketplace_id ?>&userID=<?= $logerID ?>'>-</a>
                                                    <?php
                                                    }
                                                    ?>
                                                    <span class="qty-display"><?= $items_qty ?></span>
                                                    <?php
                                                    if ($items_qty <= 6) {
                                                    ?>
                                                        <a class='qty-btn plus-btn text-decoration-none' href='cart_manage.php?cartVal=increase&packageID=<?= $marketplace_services_id ?>&marketplaceID=<?= $marketplace_id ?>&userID=<?= $logerID ?>'>+</a>
                                                    <?php
                                                    } else {
                                                        echo "<div class='qty-btn plus-btn text-decoration-none' style='pointer-events: none; opacity: 0.6; cursor: not-allowed;'>+</div>";
                                                    }
                                                    ?>
                                                </div>
                                                <?php
                                                if (isset($_GET['code'])) {
                                                    $code = $_GET['code'];
                                                    if ($code == "coupon_applied") {
                                                        $packageID = $_GET['packageID'];
                                                        $couponID = $_GET['couponID'];
                                                        $getCouponDiscount = new backend();
                                                        $GetData = $getCouponDiscount->fetching("coupons", "*", null, "id = $couponID AND marketplace_services_id = $packageID");
                                                        if (!empty($GetData)) {
                                                            $percentageDiscount = $GetData[0]['coupon_percent'];
                                                            $discountedPriceSingle = ($price_origional * $percentageDiscount) / 100;
                                                            $total_price = $discountedPriceSingle * $items_qty;
                                                            echo "<div class='price subtotal' id='subtotal-{$cart_id}'>\$" . $discountedPriceSingle * $items_qty . "</div>";
                                                        }
                                                    } else {
                                                ?>
                                                        <div class="price subtotal" id="subtotal-<?= $cart_id ?>">$<?= $items_qty * $price_origional ?></div>
                                                    <?php
                                                    }
                                                } else {
                                                    ?>

                                                    <div class="price subtotal" id="subtotal-<?= $cart_id ?>">$<?= $items_qty * $price_origional ?></div>
                                                <?php
                                                }
                                                ?>
                                            </div>

                                            <!-- Per Package Coupon Section -->
                                            <div class="package-coupon-section">
                                                <!-- Coupon Section Label -->
                                                <div class="coupon-label">
                                                    <i class="fas fa-tags"></i>
                                                    Have a coupon code?
                                                </div>

                                                <!-- Available Coupons for this Package -->
                                                <div class="available-coupons">
                                                    <div class="available-coupons-title">
                                                        <i class="fas fa-ticket-alt"></i>
                                                        Available Coupons
                                                    </div>
                                                    <div class="coupon-chips">
                                                        <?php

                                                        $coupons = $Fetchobj->fetching("coupons", "*", null, "marketplace_services_id = $marketplace_services_id");
                                                        if (!empty($coupons)) {
                                                            foreach ($coupons as $AllCoupons) {
                                                                $coupon = $AllCoupons['coupon'];
                                                                $coupon_percent = $AllCoupons['coupon_percent'];
                                                        ?>

                                                                <?php
                                                                if (isset($_GET['code'])) {
                                                                    $code = $_GET['code'];
                                                                    if ($code == "coupon_applied") {
                                                                ?>
                                                                        <div class="coupon-chip" onclick="setCouponValue('<?= $cart_id ?>', '<?= $coupon ?>')" style="opacity: 0.6; pointer-events: none;">
                                                                            <span><?= $coupon ?></span>
                                                                            <span class="coupon-discount-tag"><?= $coupon_percent ?>% OFF</span>
                                                                        </div>
                                                                    <?php
                                                                    } else {
                                                                    ?>
                                                                        <div class="coupon-chip" onclick="setCouponValue('<?= $cart_id ?>', '<?= $coupon ?>')">
                                                                            <span><?= $coupon ?></span>
                                                                            <span class="coupon-discount-tag"><?= $coupon_percent ?>% OFF</span>
                                                                        </div>
                                                                    <?php
                                                                    }
                                                                } else {
                                                                    ?>
                                                                    <div class="coupon-chip" onclick="setCouponValue('<?= $cart_id ?>', '<?= $coupon ?>')">
                                                                        <span><?= $coupon ?></span>
                                                                        <span class="coupon-discount-tag"><?= $coupon_percent ?>% OFF</span>
                                                                    </div>
                                                                <?php
                                                                }
                                                                ?>
                                                        <?php
                                                            }
                                                        } else {
                                                            echo "<div class='text-center text-danger'><i class='fas fa-tag me-1'></i><small>No coupons available</small></div>";
                                                        }
                                                        ?>
                                                    </div>
                                                </div>
                                                <?php
                                                $coupons = $Fetchobj->fetching("coupons", "*", null, "marketplace_services_id = $marketplace_services_id");
                                                if (!empty($coupons)) {
                                                ?>
                                                    <form action="cart_manage.php" method="POST" class="coupon-input-group">
                                                        <input type="hidden" name="packageID" value="<?= $marketplace_services_id ?>">
                                                        <input type="hidden" name="userID" value="<?= $logerID ?>">
                                                        <input type="hidden" name="final_price" id="final_price-<?= $cart_id ?>" value="<?= $items_qty * $price_origional ?>">
                                                        <input type="text" class="coupon-input" id="coupon-input-<?= $cart_id ?>" name="coupon_name" placeholder="Enter coupon code" value="">
                                                        <input type="submit" class="apply-coupon-btn" name="sub_coupon" value="Apply">
                                                    </form>
                                                <?php
                                                } else {
                                                    echo null;
                                                }
                                                ?>
                                            </div>
                                        </div>
                            <?php
                                    }
                                }
                            } // end foreach main
                        } else {
                            ?>
                            <div class='empty-cart text-center py-5'>
                                <i class='fas fa-shopping-cart fa-3x text-light mb-3'></i>
                                <h4 class='text-light'>Your cart is empty</h4>
                                <p class='text-light'>Add some items to get started</p>
                                <a href="../../index.php">Check Packages</a>
                            </div>
                        <?php
                        }
                        ?>

                    </div>
                </div>

                <!-- Right Column - Cart Summary -->
                <div class="col-lg-4">
                    <!-- Cart Insights -->
                    <div class="cart-insights">
                        <div class="insights-header">
                            <i class="fas fa-chart-pie"></i>
                            Cart Insights
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="insight-item">
                                    <div class="insight-value" id="total-items">
                                        <?php
                                        $getCart = $Fetchobj->fetching("cart", "*", null, "user_id = $logerID");
                                        if (!empty($getCart)) {
                                            echo count($getCart);
                                        } else {
                                            echo 0;
                                        }
                                        ?>
                                    </div>
                                    <div class="insight-label">Items</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="insight-item">
                                    <div class="insight-value">
                                        <?php
                                        if (isset($_GET['code']) && isset($_GET['couponID'])) {
                                            $code = $_GET['code'];
                                            $couponID = $_GET['couponID'];
                                            $packageID = $_GET['packageID'];
                                            if ($code == "coupon_applied") {
                                                $getCouponDiscount = new backend();
                                                $GetData = $getCouponDiscount->fetching("coupons", "*", null, "id = $couponID AND marketplace_services_id = $packageID");
                                                if (!empty($GetData)) {
                                                    $percentageDiscount = $GetData[0]['coupon_percent'];
                                                    echo $percentageDiscount . "%";
                                                }
                                            }
                                        } else {
                                            echo 0;
                                        }
                                        ?></div>
                                    <div class="insight-label">Avg Discount</div>
                                </div>
                            </div>
                        </div>

                        <!-- Per Package Breakdown -->
                        <div class="package-breakdown" id="package-breakdown">
                            <?php
                            if (!empty($getcart)) {
                                foreach ($getcart as $cartItems) {
                                    $marketplace_services_id = $cartItems['marketplace_services_id'];
                                    $marketplace_services = $Fetchobj->fetching("marketplace_services", "*", null, "id = $marketplace_services_id");
                                    if (!empty($marketplace_services)) {
                                        foreach ($marketplace_services as $packages) {
                                            $package_name = $packages['package_name'];
                            ?>
                                            <div class="breakdown-item">
                                                <span class="package-name"><?= $package_name ?></span>
                                                <span class="package-no-discount">
                                                    <!-- Discount Avilable -->
                                                    <?php
                                                    $coupons = $Fetchobj->fetching("coupons", "*", null, "marketplace_services_id = $marketplace_services_id");
                                                    if (!empty($coupons)) {
                                                        echo "Discount Available";
                                                    } else {
                                                        echo null;
                                                    }
                                                    ?>
                                                </span>
                                            </div>
                            <?php
                                        }
                                    }
                                }
                            }
                            ?>
                        </div>
                    </div>

                    <!-- Cart Totals -->

                    <?php
                    $fetchingCart = $Fetchobj->fetching("cart", "*", null, "user_id = $logerID");
                    if (!empty($fetchingCart)) {
                    ?>
                        <div class="cart-totals">
                            <div class="totals-header">Cart Totals</div>
                            <div class="total-row">
                                <span>Subtotal</span>
                                <span class="price" id="cart-subtotal">$0.00</span>
                            </div>
                            <div class="total-row">
                                <span>Total</span>
                                <span class="total-amount" id="cart-total">$0.00</span>
                            </div>
                            <a href="checkout.html" class="checkout-btn text-decoration-none">Proceed to Checkout</a>
                        </div>

                    <?php
                    } else {
                    ?>
                        <div class="cart-totals">
                            <div class="totals-header">Cart Totals</div>
                            <div class="total-row">
                                <span>Subtotal</span>
                                <span class="price" id="cart-subtotal">$0.00</span>
                            </div>
                            <div class="total-row">
                                <span>Total</span>
                                <span class="total-amount" id="cart-total">$0.00</span>
                            </div>
                            <a href="#" class="checkout-btn text-decoration-none" style="pointer-events: none; opacity: 0.6; cursor: not-allowed;">Proceed to Checkout</a>
                        </div>

                    <?php
                    }
                    ?>

                </div>
            </div>
        </div>

        <!-- ==================== Footer ==================== -->
        <footer>
            <div class="container">
                <div class="row">
                    <!-- Footer Brand -->
                    <div class="col-lg-3 col-md-6 footer-col mb-4">
                        <div class="footer-brand">
                            <div class="logo-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            SocialGrowth
                        </div>
                        <p class="footer-description">Professional social media growth services for businesses worldwide.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    <!-- Packages -->
                    <div class="col-lg-3 col-md-6 footer-col mb-4">
                        <h4 class="footer-title">Packages</h4>
                        <ul class="footer-links">
                            <li><a href="#">Buy Instagram Followers</a></li>
                            <li><a href="#">Buy Instagram Likes</a></li>
                            <li><a href="#">Buy TikTok Followers</a></li>
                            <li><a href="#">Buy Facebook Followers</a></li>
                            <li><a href="#">Buy YouTube Services</a></li>
                        </ul>
                    </div>

                    <!-- Blog -->
                    <div class="col-lg-3 col-md-6 footer-col mb-4">
                        <h4 class="footer-title">Blog</h4>
                        <ul class="footer-links">
                            <li><a href="#">Instagram Followers</a></li>
                            <li><a href="#">Instagram Business</a></li>
                            <li><a href="#">Marketing</a></li>
                            <li><a href="#">Make Money</a></li>
                            <li><a href="#">Tips and Growth</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div class="col-lg-3 col-md-6 footer-col mb-4">
                        <h4 class="footer-title">Contact</h4>
                        <ul class="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="copyright">
                    © 2025 SocialGrowth. All Rights Reserved.
                </div>
            </div>
        </footer>

        <!-- Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            // Function to set coupon value in input field
            function setCouponValue(cartId, couponCode) {
                const couponInput = document.getElementById('coupon-input-' + cartId);
                couponInput.value = couponCode;
            }

            // Initialize cart totals on page load
            document.addEventListener('DOMContentLoaded', function() {
                updateCartTotals();
            });

            // Function to update quantity via AJAX
            function updateQuantity(cartId, action) {
                const qtyDisplay = document.getElementById('qty-' + cartId);
                let currentQty = parseInt(qtyDisplay.textContent);

                // Update quantity based on action
                if (action === 'increase' && currentQty < 5) {
                    currentQty++;
                } else if (action === 'decrease' && currentQty > 1) {
                    currentQty--;
                } else {
                    return; // Don't proceed if limits reached
                }

                // Get the original price for this item
                const cartItem = document.querySelector('.cart-item[data-cart-id="' + cartId + '"]');
                const priceElement = cartItem.querySelector('.price:not(.subtotal)');
                const originalPrice = parseFloat(priceElement.textContent.replace('$', ''));

                // Calculate new subtotal
                const newSubtotal = originalPrice * currentQty;

                // Update display immediately for better UX
                qtyDisplay.textContent = currentQty;

                // Update subtotal display
                const subtotalElement = document.getElementById('subtotal-' + cartId);
                subtotalElement.textContent = '$' + newSubtotal.toFixed(2);

                // Update the final_price input field for coupon form
                const finalPriceInput = document.getElementById('final_price-' + cartId);
                finalPriceInput.value = newSubtotal.toFixed(2);

                // Update cart totals
                updateCartTotals();

                // Send AJAX request to update database
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'update_quantity.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (!response.success) {
                            // Revert display if update failed
                            qtyDisplay.textContent = response.oldQuantity;
                            const oldSubtotal = originalPrice * response.oldQuantity;
                            subtotalElement.textContent = '$' + oldSubtotal.toFixed(2);
                            finalPriceInput.value = oldSubtotal.toFixed(2);
                            updateCartTotals();
                            alert('Failed to update quantity: ' + response.message);
                        }
                    }
                };

                xhr.send('cart_id=' + cartId + '&new_quantity=' + currentQty);
            }

            // Function to update cart totals
            function updateCartTotals() {
                let subtotal = 0;
                const subtotalElements = document.querySelectorAll('.subtotal');

                subtotalElements.forEach(function(element) {
                    const priceText = element.textContent.replace('$', '');
                    subtotal += parseFloat(priceText);
                });

                document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
                document.getElementById('cart-total').textContent = '$' + subtotal.toFixed(2);
            }

            // Function to remove cart item
            function removeCartItem(cartId) {
                if (confirm('Are you sure you want to remove this item from your cart?')) {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'remove_cart_item.php', true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                // Remove item from DOM
                                document.querySelector('.cart-item[data-cart-id="' + cartId + '"]').remove();
                                updateCartTotals();

                                // Update items count
                                const totalItems = document.querySelectorAll('.cart-item').length;
                                document.getElementById('total-items').textContent = totalItems;

                                // Show empty cart message if no items left
                                if (totalItems === 0) {
                                    document.querySelector('.cart-section').innerHTML =
                                        '<div class="empty-cart text-center py-5">' +
                                        '<i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>' +
                                        '<h4 class="text-muted">Your cart is empty</h4>' +
                                        '<p class="text-muted">Add some items to get started</p>' +
                                        '</div>';
                                }
                            } else {
                                alert('Failed to remove item: ' + response.message);
                            }
                        }
                    };

                    xhr.send('cart_id=' + cartId);
                }
            }

            // Minimal JavaScript to auto-hide the toast after 2 seconds
            document.addEventListener('DOMContentLoaded', function() {
                const toastElement = document.getElementById('successToast');
                if (toastElement) {
                    const toast = new bootstrap.Toast(toastElement, {
                        autohide: true,
                        delay: 2000
                    });

                    // Show the toast
                    toast.show();

                    // Remove the toast from DOM after it's hidden
                    toastElement.addEventListener('hidden.bs.toast', function() {
                        this.remove();
                    });
                }
            });
        </script>
    </body>

    </html>

<?php
} else {
    if (isset($_GET['cartQuantity'])) {
        $cartQuantity = $_GET['cartQuantity'];
        $marketplaceID = $_GET['marketplaceID'];
        $packageID = $_GET['packageID'];

        header("location: ../pages/logins/login.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity&message=cart_empty");
    } else {
        echo header("location: ../pages/logins/login.php?message=cart_empty");
    }
}
?>