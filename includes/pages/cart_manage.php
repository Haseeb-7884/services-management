<?php
include("../connection.php");

if (isset($_GET['remove'])) {
    $remove = $_GET['remove'];
    $removeObj = new backend();

    $deletingID = $removeObj->deletion("cart", "id = $remove");
    if (!empty($deletingID)) {
        header("location: cart_details.php?code=cartID_deleted");
    }
}

if (isset($_GET['cartVal'])) {
    $cartVal = $_GET['cartVal'];
    $packageID = $_GET['packageID'];
    $marketplaceID = $_GET['marketplaceID'];
    $userID = $_GET['userID'];
    $cartUpdateObj = new backend();
    if ($cartVal == 'increase') {
        $getCartQty = $cartUpdateObj->fetching("cart", "items_qty", null, "marketplace_id = $marketplaceID AND marketplace_services_id = $packageID AND user_id = $userID", null);
        if (!empty($getCartQty)) {
            $currentCartQty = $getCartQty[0]['items_qty'];
            $newCartQty = $currentCartQty + 1;
            $cartUpdate = $cartUpdateObj->update("cart", array(
                "items_qty" => $newCartQty
            ), "marketplace_id = $marketplaceID AND marketplace_services_id = $packageID AND user_id = $userID", null);
            if (!empty($cartUpdate)) {
                header("location: cart_details.php?code=updated_qty&packageID=$packageID&cartQuantity=$newCartQty&marketplaceID=$marketplaceID");
            }
        }
    } elseif ($cartVal == 'decrease') {
        $getCartQty = $cartUpdateObj->fetching("cart", "items_qty", null, "marketplace_id = $marketplaceID AND marketplace_services_id = $packageID AND user_id = $userID", null);
        if (!empty($getCartQty)) {
            $currentCartQty = $getCartQty[0]['items_qty'];
            $newCartQty = $currentCartQty - 1;
            $cartUpdate = $cartUpdateObj->update("cart", array(
                "items_qty" => $newCartQty
            ), "marketplace_id = $marketplaceID AND marketplace_services_id = $packageID AND user_id = $userID", null);
            if (!empty($cartUpdate)) {
                header("location: cart_details.php?code=updated_qty&packageID=$packageID&cartQuantity=$newCartQty&marketplaceID=$marketplaceID");
            }
        }
    } else {
        echo null;
    }
} else {
    echo "Connection not found";
}


if (isset($_POST['sub_coupon'])) {
    $coupon_name = $_POST['coupon_name'];
    $packageID = $_POST['packageID'];
    $logerID = $_POST['userID'];
    $final_price = $_POST['final_price'];
    echo $coupon_name;

    $couponObj = new backend();

    $updateCoupon = $couponObj->update("cart", array(
        "applied_coupon" => $coupon_name,
        "final_price" => $final_price
    ), "marketplace_services_id = $packageID AND user_id = $logerID", null);

    if (!empty($updateCoupon)) {

        $fetchingCoupon = $couponObj->fetching("coupons", "*", null, "coupon = '$coupon_name'");

        if (!empty($fetchingCoupon)) {
            foreach ($fetchingCoupon as $coupon) {
                $coupon_id = $coupon['id'];
                $applied_coupon = $coupon['coupon'];
                $remaining_qty = $coupon['remaining_qty'];
                $updated_remaining_qty = $remaining_qty - 1;

                $updatingCoupon = $couponObj->update("coupons", array(
                    "remaining_qty" => $updated_remaining_qty
                ), "id = $coupon_id");

                if (!empty($updatingCoupon)) {
                    header("location: cart_details.php?code=coupon_applied&couponID=$coupon_id&packageID=$packageID");
                }
            }
        }
    }
}

