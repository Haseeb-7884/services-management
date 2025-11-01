<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Custom Toast Notification</title>

  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
    rel="stylesheet" />
  <!-- Font Awesome -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

  <style>
    /* Unique Toast Styles */
    .gec-toast-wrapper {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      min-width: 350px;
    }

    .gec-toast-box {
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
      overflow: hidden;
    }

    .gec-toast-box.gec-show {
      opacity: 1;
      transform: translateX(0);
      animation: gec-slide-in 0.3s ease-out;
    }

    @keyframes gec-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }

      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .gec-close-btn {
      opacity: 0.8;
      transition: all 0.2s ease;
    }

    .gec-close-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    .gec-toast-text {
      flex-wrap: wrap;
      padding: 14px 18px;
  
    }

    .gec-toast-text i {
      margin-right: 12px;
    }

    .gec-toast-text .fw-bold {
      font-size: 1rem;
    }

    .gec-toast-text .small {
      opacity: 0.9;
    }

    .gec-demo-section {
      max-width: 800px;
      margin: 100px auto;
      padding: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <!-- Toast Container -->
  <div class="gec-toast-wrapper" id="gecToastWrapper">
    <div
      class="gec-toast-box align-items-center text-bg-danger border-0 gec-show"
      id="gecErrorToast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true">
      <div class="d-flex">
        <div class="gec-toast-text d-flex align-items-center flex-grow-1">
          <i class="fas fa-exclamation-triangle fs-4"></i>
          <div class="flex-grow-1">
            <div class="fw-bold">Authentication Required</div>
            <div class="small text-light opacity-75" style="font-size:13px;">Please sign in to submit your review</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

  <script>
    // Unique JS for toast behavior
    document.addEventListener("DOMContentLoaded", function() {
      const gecToastEl = document.getElementById("gecErrorToast");
      const gecToast = new bootstrap.Toast(gecToastEl, {
        autohide: true,
        delay: 2000,
      });

      gecToast.show();

      // Remove from DOM after hidden
      gecToastEl.addEventListener("hidden.bs.toast", function() {
        this.remove();
      });
    });
  </script>
</body>

</html>