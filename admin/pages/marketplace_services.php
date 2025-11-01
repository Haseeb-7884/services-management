<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Your Marketplace</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .main-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .sub-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header-section {
            text-align: center;
            margin-bottom: 40px;
        }

        .main-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            font-size: 0.9375rem;
            color: #6c757d;
            font-weight: 400;
        }

        .marketplace-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            padding: 0 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .marketplace-card {
            background: white;
            border-radius: 12px;
            padding: 24px 16px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-height: 200px;
        }

        .marketplace-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .icon-wrapper {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }

        .icon-wrapper svg {
            width: 40px;
            height: 40px;
        }

        .marketplace-name {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
        }

        .manage-btn {
            background-color: #1e293b;
            color: white;
            border: none;
            padding: 10px 32px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            max-width: 140px;
        }

        .manage-btn:hover {
            background-color: #334155;
            transform: scale(1.02);
        }

        .manage-btn:active {
            transform: scale(0.98);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .marketplace-grid {
                grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .main-title {
                font-size: 1.75rem;
            }

            .subtitle {
                font-size: 0.875rem;
            }

            .marketplace-grid {
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 16px;
            }

            .marketplace-card {
                padding: 20px 14px;
                min-height: 180px;
            }

            .icon-wrapper {
                width: 45px;
                height: 45px;
            }

            .icon-wrapper svg {
                width: 36px;
                height: 36px;
            }

            .marketplace-name {
                font-size: 1rem;
            }
        }

        @media (max-width: 576px) {
            body {
                padding: 25px 12px;
            }

            .main-title {
                font-size: 1.5rem;
            }

            .header-section {
                margin-bottom: 30px;
            }

            .marketplace-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                padding: 0;
            }

            .marketplace-card {
                padding: 18px 12px;
                min-height: 170px;
            }

            .manage-btn {
                padding: 8px 24px;
                font-size: 0.8125rem;
            }
        }
    </style>
</head>

<body>
    <div class="main-container">
        <div class="sub-container">
            <div class="header-section">
                <h1 class="main-title">Select Your Marketplace</h1>
                <p class="subtitle">Add services or packages, or manage packages of the listed marketplaces.</p>
            </div>

            <div class="marketplace-grid">

                <?php
                $fetchingMarketplaces = new backend();
                $getMarketplaces = $fetchingMarketplaces->fetching("marketplaces", "*", null, null);
                if (!empty($getMarketplaces)) {
                    foreach ($getMarketplaces as $marketplace) {
                        $id = $marketplace['id'];
                        $marketplace_name = $marketplace['marketplace_name'];
                ?>
                        <div class="marketplace-card">
                            <div class="icon-wrapper">
                                <?php
                                if ($marketplace_name == "Instagram") {
                                ?>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#instagram-gradient)" stroke-width="2" />
                                        <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" stroke-width="2" />
                                        <circle cx="17.5" cy="6.5" r="1" fill="url(#instagram-gradient)" />
                                        <defs>
                                            <linearGradient id="instagram-gradient" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#FD5949" />
                                                <stop offset="0.5" stop-color="#D6249F" />
                                                <stop offset="1" stop-color="#285AEB" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                <?php
                                } elseif ($marketplace_name == "Facebook") {
                                ?>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2" />
                                    </svg>
                                <?php
                                } elseif ($marketplace_name == "TikTok") {
                                ?>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 11V17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17V7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15 9C15.7956 9.68326 16.8397 10.0812 17.9291 9.99936C19.0185 9.91751 20 9.36503 20 8.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2" />
                                    </svg>
                                <?php
                                } elseif ($marketplace_name == "YouTube") {
                                ?>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 8L16 12L10 16V8Z" fill="#FF0000" />
                                        <path d="M21.5 7.5C21.5 7.5 21.3 6.1 20.7 5.5C19.9 4.7 19 4.7 18.6 4.7C15.6 4.5 12 4.5 12 4.5C12 4.5 8.4 4.5 5.4 4.7C5 4.7 4.1 4.7 3.3 5.5C2.7 6.1 2.5 7.5 2.5 7.5C2.5 7.5 2.3 9.1 2.3 10.7V12.4C2.3 14 2.5 15.6 2.5 15.6C2.5 15.6 2.7 17 3.3 17.6C4.1 18.4 5.1 18.4 5.6 18.5C7.2 18.6 12 18.7 12 18.7C12 18.7 15.6 18.7 18.6 18.4C19 18.4 19.9 18.4 20.7 17.6C21.3 17 21.5 15.6 21.5 15.6C21.5 15.6 21.7 14 21.7 12.4V10.7C21.7 9.1 21.5 7.5 21.5 7.5Z" stroke="#FF0000" stroke-width="1.5" />
                                    </svg>
                                <?php
                                }
                                ?>
                            </div>

                            <h3 class="marketplace-name"><?= $marketplace_name ?></h3>
                            <a href="pages/route.php?request=EditPacakges&packageID=<?= $id ?>" class="manage-btn text-decoration-none">Manage</a>
                        </div>
                <?php
                    } // foreach loop ends
                } // if ends 
                ?>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>