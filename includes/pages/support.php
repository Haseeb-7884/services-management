<?php 
include("../connection.php");
if(isset($_POST['suggestion_submit'])){
    $client_name = $_POST['customer_name'];
    $select_category = $_POST['select_category'];
    $suggestion_title = $_POST['suggestion_title'];
    $marketplaceID = $_POST['marketplaceID'];
    $packageID = $_POST['packageID'];

    $fetechObj = new backend();
    $insertData = $fetechObj->insertion("customer_suggestions", 
    array("customer_name" => $client_name, 
    "select_category" => $select_category, 
    "suggestion_title" => $suggestion_title, 
    "marketplaceID" => $marketplaceID, 
    "marketplace_service_id" => $packageID));

    if(!empty($insertData)){
        header("location: services_content.php?marketplaceID=$marketplaceID&PackageID=$packageID&status=success");
    }else{
        echo "Query is not workign";
    }

}
?>