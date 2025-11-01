<?php
include("../connection.php");


if (isset($_GET['cartQuantity'])) {
    $packageID = $_GET['packageID'];
    $marketplaceID = $_GET['marketplaceID'];
    $cartQuantity = $_GET['cartQuantity'];
    $logID = $_SESSION['id'];

    echo $packageID;
    echo $marketplaceID;
    echo $cartQuantity;
    echo $logID;

    if (isset($_SESSION['id'])) {

        $mainObj = new backend();

        $fetchData = $mainObj->fetching("cart", "*", null, "user_id = $logID AND marketplace_id = $marketplaceID AND marketplace_services_id = $packageID");

        if (!empty($fetchData)) {

            $cartID = $fetchData[0]['id'];
            $cartUpdate = $mainObj->update("cart", array(
                "items_qty" => $cartQuantity
            ), "id = $cartID AND marketplace_id = $marketplaceID AND marketplace_services_id = $packageID AND user_id = $userID", null);

            if (!empty($cartUpdate)) {
                header("location: cart_details.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
            }
        } else {

            $addingData = $mainObj->insertion("cart", array(
                "items_qty" => $cartQuantity,
                "marketplace_id" => $marketplaceID,
                "user_id" => $logID,
                "marketplace_services_id" => $packageID,
            ));

            if (!empty($addingData)) {
                header("location: ../pages/logins/loader.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
            }
        }
    } else {
        header("location: ../pages/logins/login.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity&message=cart_empty");
    }
} else {
    echo "Not received ids requried";
}