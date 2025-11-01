<?php
if(isset($_POST['reviewSubmit'])){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $rating = $_POST['rating'];
    $review_text = $_POST['review_text'];
    $packageID = $_POST['packageID'];

    if(isset($_SESSION['id'])){
        $suerID = $_SESSION['id'];
        $insertReview = new backend();
        $Reviews = $insertReview->insertion('reviews', array(
            "rating" => $rating,
            "description" => $review_text,
            "services_details_id" => $packageID,
            "user_id" => $suerID
        ));
    }


}
?>

<!-- review_empty -->