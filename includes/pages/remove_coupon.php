<?php
include("../connection.php");
session_start();

if (isset($_SESSION['id'])) {
    $logerID = $_SESSION['id'];
    
    if (isset($_POST['cart_id'])) {
        $cart_id = intval($_POST['cart_id']);
        $Fetchobj = new backend();
        
        // Get cart item
        $cart_item = $Fetchobj->fetching("cart", "*", null, "id = $cart_id AND user_id = $logerID");
        if (!empty($cart_item)) {
            $cart_item = $cart_item[0];
            $applied_coupon = $cart_item['applied_coupon'];
            $marketplace_services_id = $cart_item['marketplace_services_id'];
            $items_qty = $cart_item['items_qty'];
            
            if ($applied_coupon) {
                // Restore coupon quantity
                $coupon = $Fetchobj->fetching("coupons", "*", null, "coupon = '$applied_coupon' AND marketplace_services_id = $marketplace_services_id");
                if (!empty($coupon)) {
                    $coupon = $coupon[0];
                    $new_remaining_qty = $coupon['remaining_qty'] + 1;
                    $Fetchobj->update("coupons", ['remaining_qty' => $new_remaining_qty], "id = {$coupon['id']}");
                }
                
                // Recalculate price
                $package = $Fetchobj->fetching("marketplace_services", "*", null, "id = $marketplace_services_id");
                if (!empty($package)) {
                    $package = $package[0];
                    $new_subtotal = $package['price_origional'] * $items_qty;
                    
                    // Remove coupon from cart
                    $update_cart = $Fetchobj->update("cart", [
                        'applied_coupon' => NULL,
                        'final_price' => $new_subtotal
                    ], "id = $cart_id");
                    
                    if ($update_cart) {
                        echo json_encode(['success' => true, 'message' => 'Coupon removed successfully']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to remove coupon']);
                    }
                }
            }
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
}
?>