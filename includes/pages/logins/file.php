<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toast Notification Demo</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 350px;
        }

        .toast {
            min-width: 350px;
            max-width: 500px;
            width: auto;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            margin-bottom: 10px;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .btn-close {
            opacity: 0.8;
            transition: all 0.2s ease;
        }

        .btn-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        /* Animation for toast entry */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast.show {
            animation: slideInRight 0.3s ease-out;
        }

        /* Ensure toast body text wraps properly */
        .toast-body {
            flex-wrap: wrap;
        }

        .demo-content {
            max-width: 800px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- <div class="demo-content">
        <h1>Toast Notification Demo</h1>
        <p class="lead">This page demonstrates a toast notification with auto-hide functionality</p>
        <p>The error toast will appear automatically and hide after 2 seconds</p>
    </div> -->

    <!-- Toast Container with Hardcoded Toast -->
    <div class="toast-container" id="toastContainer">
        <div class="toast align-items-center text-bg-danger border-0 show" id="errorToast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center flex-grow-1">
                    <i class="fas fa-exclamation-triangle me-3 fs-4"></i>
                    <div class="flex-grow-1">
                        <div class="fw-bold">Connection Error</div>
                        <div class="small">Error in establishing connection. Please try again.</div>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Minimal JavaScript to auto-hide the toast after 2 seconds
        document.addEventListener('DOMContentLoaded', function() {
            const toastElement = document.getElementById('errorToast');
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
        });
    </script>
</body>
</html>