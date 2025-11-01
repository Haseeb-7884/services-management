<?php
// header("Location: ../cart_details.php?packageID=$packageID&marketplaceID=$marketplaceID&cartQuantity=$cartQuantity");
include("../../connection.php");
if (isset($_SESSION['id'])) {

    if (isset($_GET['cartQuantity'])) {
        $packageID = $_GET['packageID'];
        $marketplaceID = $_GET['marketplaceID'];
        $cartQuantity = $_GET['cartQuantity'];
        $logID = $_SESSION['id'];

        // $addObj = new backend();

        // $addingData = $addObj->insertion("cart", array(
        //     "items_qty" => $cartQuantity,
        //     "marketplace_id" => $marketplaceID,
        //     "user_id" => $logID,
        //     "marketplace_services_id" => $packageID,
        // ));

?>
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Authorization Successful - SocialGrowth</title>

                <!-- Bootstrap CSS -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

                <!-- Font Awesome -->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

                <!-- Google Fonts -->
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

                <!-- External Style Sheet -->
                <link rel="stylesheet" href="../../../assets/css/loader.css">
            </head>

            <body>
                <!-- Background Animation -->
                <div class="background-animation">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>

                <!-- Loader Container -->
                <div class="loader-container">
                    <!-- Success Icon -->
                    <div class="success-icon-wrapper">
                        <div class="success-icon">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>

                    <!-- Loader Content -->
                    <div class="loader-content">
                        <h1>Authorization Successful!</h1>
                        <p>Your authentication has been verified successfully. We're now redirecting you to your shopping cart to complete your purchase.</p>

                        <!-- Progress Bar -->
                        <div class="progress-wrapper">
                            <div class="progress-label">
                                <span>Redirecting...</span>
                                <span id="progressPercent">0%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>

                        <!-- Countdown -->
                        <div class="countdown">
                            Redirecting in <span id="countdown">5</span> seconds...
                        </div>
                    </div>
                </div>

                <!-- Bootstrap JS -->
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

                <!-- Redirect Script -->
                <script>
                    // Pass PHP variables into JavaScript
                    const packageID = "<?php echo $packageID; ?>";
                    const marketplaceID = "<?php echo $marketplaceID; ?>";
                    const quantity = "<?php echo $cartQuantity; ?>";

                    let countdown = 5;
                    const countdownElement = document.getElementById('countdown');
                    const progressPercent = document.getElementById('progressPercent');
                    const progressBar = document.querySelector('.progress-bar');

                    const countdownInterval = setInterval(() => {
                        countdown--;
                        countdownElement.textContent = countdown;

                        const percentComplete = ((5 - countdown) / 5) * 100;
                        progressPercent.textContent = Math.round(percentComplete) + '%';
                        progressBar.style.width = percentComplete + '%';

                        if (countdown === 0) {
                            clearInterval(countdownInterval);
                            window.location.href = `../cart_details.php?packageID=${packageID}&marketplaceID=${marketplaceID}&cartQuantity=${quantity}`;
                        }
                    }, 1000);

                    // Optional: Click to redirect immediately
                    document.querySelector('.loader-content').addEventListener('click', () => {
                        clearInterval(countdownInterval);
                        window.location.href = `../cart_details.php?packageID=${packageID}&marketplaceID=${marketplaceID}&cartQuantity=${quantity}`;
                    });
                </script>

            </body>

            </html>
<?php
    }
} else {
    echo "Connection Error";
}
?>