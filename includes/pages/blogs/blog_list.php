<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DigiScale - Insights & Resources</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0a1628;
            color: #ffffff;
        }

        /* Hero Section with Background Image */
        .hero-section {
            background: linear-gradient(rgba(10, 22, 40, 0.85), rgba(10, 22, 40, 0.85)), 
                        url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=800&fit=crop') center/cover no-repeat;
            padding: 100px 0 80px;
            text-align: center;
        }

        .hero-section h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
        }

        .hero-section h1 .highlight {
            color: #00d4ff;
        }

        .hero-section p {
            font-size: 1.125rem;
            color: #a0aec0;
            max-width: 700px;
            margin: 0 auto;
        }

        /* Blog Cards Section */
        .blog-section {
            padding: 60px 0;
            background-color: #0a1628;
        }

        /* Row Spacing */
        .blog-section .row {
            margin-bottom: 30px;
        }

        .blog-section .row:last-child {
            margin-bottom: 0;
        }

        /* Column Spacing */
        .blog-section [class*="col-"] {
            margin-bottom: 30px;
        }

        /* Blog Card Styling */
        .blog-card {
            background-color: #1a2942;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 212, 255, 0.2);
        }

        /* Card Image */
        .blog-card-img {
            width: 100%;
            height: 220px;
            object-fit: cover;
        }

        /* Card Body */
        .blog-card-body {
            padding: 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        /* Card Meta Information */
        .blog-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 0.875rem;
            color: #718096;
        }

        .blog-meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .blog-meta-icon {
            width: 14px;
            height: 14px;
        }

        /* Card Title */
        .blog-card-title {
            font-size: 1.375rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        /* Card Description */
        .blog-card-description {
            color: #a0aec0;
            font-size: 0.9375rem;
            line-height: 1.6;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        /* Read More Link */
        .read-more {
            color: #00d4ff;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9375rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: gap 0.3s ease;
        }

        .read-more:hover {
            gap: 10px;
            color: #00b8e6;
        }

        .read-more::after {
            content: '→';
            font-size: 1.125rem;
        }

        /* Pagination Section */
        .pagination-section {
            padding: 40px 0 80px;
            display: flex;
            justify-content: center;
        }

        .pagination-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .pagination-btn {
            background-color: #1a2942;
            color: #ffffff;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .pagination-btn:hover {
            background-color: #2d3f5f;
        }

        .pagination-btn.active {
            background-color: #00d4ff;
            color: #0a1628;
        }

        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Responsive Design for Tablets */
        @media (max-width: 992px) {
            .hero-section h1 {
                font-size: 2.75rem;
            }

            .blog-card-title {
                font-size: 1.25rem;
            }
        }

        /* Responsive Design for Mobile */
        @media (max-width: 768px) {
            .hero-section {
                padding: 60px 0 50px;
            }

            .hero-section h1 {
                font-size: 2rem;
            }

            .hero-section p {
                font-size: 1rem;
            }

            .blog-section {
                padding: 40px 0;
            }

            .blog-section .row {
                margin-bottom: 0;
            }

            .blog-section [class*="col-"] {
                margin-bottom: 24px;
            }

            .blog-card-img {
                height: 200px;
            }

            .blog-card-body {
                padding: 20px;
            }

            .blog-card-title {
                font-size: 1.125rem;
            }

            .blog-card-description {
                font-size: 0.875rem;
            }

            .pagination-btn {
                padding: 10px 16px;
                font-size: 0.875rem;
            }
        }

        /* Extra Small Mobile */
        @media (max-width: 576px) {
            .hero-section h1 {
                font-size: 1.75rem;
            }

            .blog-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .pagination-container {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    
    <!-- Hero Section with Background Image -->
    <section class="hero-section">
        <div class="container">
            <h1>Insights & <span class="highlight">Resources</span></h1>
            <p>Explore our expert insights, growth strategies, and social media trends.</p>
        </div>
    </section>

    <!-- Blog Cards Section -->
    <section class="blog-section">
        <div class="container">
            <!-- First Row of Blog Cards -->
            <div class="row">
                
                <!-- Blog Card 1 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
                             alt="Team meeting" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 15, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    Sarah Johnson
                                </span>
                            </div>
                            <h3 class="blog-card-title">Social Media Marketing Trends for 2025</h3>
                            <p class="blog-card-description">
                                Discover the latest trends shaping social media marketing and how to leverage them for maximum growth and engagement.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

                <!-- Blog Card 2 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop" 
                             alt="Instagram workspace" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 12, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    Michael Chen
                                </span>
                            </div>
                            <h3 class="blog-card-title">Building a Strong Instagram Presence</h3>
                            <p class="blog-card-description">
                                Learn proven strategies to grow your Instagram following organically and create content that resonates with your audience.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

                <!-- Blog Card 3 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop" 
                             alt="Content strategy meeting" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 10, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    Emily Roberts
                                </span>
                            </div>
                            <h3 class="blog-card-title">Content Strategy That Converts</h3>
                            <p class="blog-card-description">
                                Master the art of creating compelling content that drives conversions and builds lasting relationships with your audience.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Second Row of Blog Cards -->
            <div class="row">
                
                <!-- Blog Card 4 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                             alt="Analytics dashboard" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 8, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    David Park
                                </span>
                            </div>
                            <h3 class="blog-card-title">Analytics & Data-Driven Marketing</h3>
                            <p class="blog-card-description">
                                Unlock the power of analytics to make informed decisions and optimize your social media campaigns for better ROI.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

                <!-- Blog Card 5 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop" 
                             alt="Influencer collaboration" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 5, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    Lisa Anderson
                                </span>
                            </div>
                            <h3 class="blog-card-title">The Future of Influencer Marketing</h3>
                            <p class="blog-card-description">
                                Explore how influencer marketing is evolving and discover strategies to collaborate with creators effectively.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

                <!-- Blog Card 6 -->
                <div class="col-lg-4 col-md-6">
                    <div class="blog-card">
                        <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop" 
                             alt="Video production" 
                             class="blog-card-img">
                        <div class="blog-card-body">
                            <div class="blog-meta">
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                    Mar 3, 2025
                                </span>
                                <span class="blog-meta-item">
                                    <svg class="blog-meta-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                                    </svg>
                                    James Wilson
                                </span>
                            </div>
                            <h3 class="blog-card-title">Video Marketing Best Practices</h3>
                            <p class="blog-card-description">
                                Video content dominates social media. Learn how to create engaging videos that capture attention and drive results.
                            </p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Pagination Section -->
    <section class="pagination-section">    
        <div class="pagination-container">
            <button class="pagination-btn" disabled>← Previous</button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">3</button>
            <button class="pagination-btn">Next →</button>
        </div>
    </section>

    <!-- Bootstrap Bundle JS (Required for Bootstrap components) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
</body>
</html>