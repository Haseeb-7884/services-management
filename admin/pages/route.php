<?php
if (isset($_GET['request'])) {
    $status = $_GET['request'];
    $packageID = $_GET['packageID'];
    $CurrentStatus = $_GET['CurrentStatus'];

    if ($status == 'EditServices') {
        echo "hello";
        header('location: ../index.php?RequestFarward=EditServices');
    }
    if ($status == 'EditPacakges' || !empty($packageID)) {
        echo "hello";
        header("location: ../index.php?RequestFarward=EditPacakges&packageID=$packageID");
    }
    if ($status == 'PacakgesDetails') {
        echo "hello";
        header("location: ../index.php?RequestFarward=PacakgesDetails&packageID=$packageID");
    }
    // if ($status == 'EditPacakges' && $CurrentStatus == 'updated') {
    //     echo "hello";
    //     header("location: ../index.php?RequestFarward=EditPacakges&packageID=$packageID&CurrentStatus=updated");
    // }
    // --------------------------------
    // coupons routes 
    // --------------------------------
    if ($status == 'CouponManage') {
        echo "hello";
        header("location: ../index.php?RequestFarward=CouponManage");
    }
}
