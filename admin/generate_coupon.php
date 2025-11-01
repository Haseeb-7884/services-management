<?php
function generateCouponCode($length = 6) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $couponCode = '';
    $max = strlen($characters) - 1;

    for ($i = 0; $i < $length; $i++) {
        $couponCode .= $characters[mt_rand(0, $max)];
    }

    return $couponCode;
}

// Generate a coupon code
$generatedCoupon = generateCouponCode();

// Return the generated coupon code as the response
echo $generatedCoupon;
?>
