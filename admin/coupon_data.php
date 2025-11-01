<?php

include '../includes/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['coupon_submit'])) {
    
    // Set to US Eastern Time
    date_default_timezone_set('America/New_York');
    
    // Get form data
    $coupon = trim($_POST['coupon']);
    $coupon_percent = trim($_POST['coupon_percent']);
    $coupons_quantity = trim($_POST['coupons_quantity']);
    $coupon_expiry = trim($_POST['coupon_expiry']); // This now includes date + time
    $marketplace_id = trim($_POST['marketplace_id']);
    $marketplace_services_id = trim($_POST['marketplace_services_id']);
    $cou_percentage = trim($_POST['cou_percentage']);
    
    // Validate required fields
    if (empty($coupon) || empty($coupon_percent) || empty($coupons_quantity) || 
        empty($coupon_expiry) || empty($marketplace_id) || empty($marketplace_services_id)) {
        
        // header("Location: index.php?sending=empty_fields");
    }
    
    // Validate numeric fields
    if (!is_numeric($coupon_percent) || !is_numeric($coupons_quantity)) {
        // header("Location: index.php?sending=invalid_numeric");
    }
    
    // Convert datetime-local format to MySQL format and validate
    $current_datetime = date('Y-m-d H:i:s');
    
    // Convert coupon_expiry from "YYYY-MM-DDTHH:MM" to "YYYY-MM-DD HH:MM:SS"
    $coupon_expiry_mysql = str_replace('T', ' ', $coupon_expiry) . ':00';
    
    if ($coupon_expiry_mysql < $current_datetime) {
        // header("Location: index.php?sending=invalid_date");
    }
    
    // Check if coupon already exists
    $db = new backend();
    $existing_coupon = $db->fetching('coupons', 'id', null, "coupon = '$coupon'");
    
    if ($existing_coupon) {
        // header("Location: index.php?sending=coupon_exists");
    }
    
    // Prepare data for insertion
    $coupon_data = array(
        'coupon' => $coupon,
        'coupon_percent' => $coupon_percent,
        'coupons_quantity' => $coupons_quantity,
        'coupon_expiry' => $coupon_expiry_mysql, // Now includes proper date + time
        'remaining_qty' => $coupons_quantity,
        'marketplace_id' => $marketplace_id,
        'marketplace_services_id' => $marketplace_services_id,
        'coupon_creation' => $current_datetime // US Eastern Time timestamp
    );
    
    // Insert into database
    $insert_result = $db->insertion('coupons', $coupon_data);
    
    if ($insert_result) {
        // header("Location: index.php?sending=success");
        echo "Data inserted Succesfully";
    } else {
        // header("Location: index.php?sending=database_error");
    }
    
} else {
    // header("Location: index.php?sending=invalid_access");
}
?>