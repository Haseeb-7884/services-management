<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Management Form</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        /* Root Variables for Easy Theming */
        :root {
            --primary-gradient: linear-gradient(135deg, #17a2b8 0%, #d946a6 100%);
            --primary-color: #17a2b8;
            --danger-color: #dc3545;
            --bg-light: #f8f9fa;
            --border-color: #dee2e6;
            --text-muted: #6c757d;
        }

        /* Body and Main Container Styles */
        body {
            background-color: var(--bg-light);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        /* Main Content Wrapper - Scrollable */
        .main-content {
            padding: 20px;
            padding-bottom: 20px;
            max-height: 100vh;
            overflow-y: auto;
        }

        /* Package Info Section */
        .package-info-section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Section Container Styles */
        .section-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Section Title Styles */
        .section-title {
            color: var(--primary-color);
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Individual Item Card (Description/Service Card) */
        .item-card {
            background: #f8f9fa;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            position: relative;
        }

        /* Item Header with Delete Button */
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .item-label {
            font-weight: 600;
            color: #495057;
            font-size: 0.95rem;
        }

        /* Delete Button Styles */
        .delete-btn {
            background: none;
            border: none;
            color: var(--danger-color);
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .delete-btn:hover {
            background: #ffe6e6;
        }

        /* Form Labels */
        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        /* Input Fields */
        .form-control {
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 10px 15px;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.15);
        }

        /* Rich Text Editor Toolbar */
        .editor-toolbar {
            background: white;
            border: 1px solid var(--border-color);
            border-bottom: none;
            border-radius: 6px 6px 0 0;
            padding: 8px;
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }

        .editor-toolbar button {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #495057;
        }

        .editor-toolbar button:hover {
            background: var(--bg-light);
            border-color: var(--primary-color);
        }

        /* Editor Textarea */
        .editor-content {
            border: 1px solid var(--border-color);
            border-radius: 0 0 6px 6px;
            padding: 15px;
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
            line-height: 1.6;
        }

        .editor-content:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.15);
        }

        /* Add New Button Styles */
        .add-new-btn {
            background: var(--primary-gradient);
            border: none;
            color: white;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
        }

        .add-new-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
        }

        .fixed-button-container {
            padding: 20px 0;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 20px;
        }

        /* Submit Button */
        .submit-btn {
            background: var(--primary-gradient);
            border: none;
            color: white;
            padding: 12px 35px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
        }

        /* Cancel Button */
        .cancel-btn {
            background: white;
            border: 2px solid var(--border-color);
            color: #495057;
            padding: 12px 35px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .cancel-btn:hover {
            border-color: var(--danger-color);
            color: var(--danger-color);
            text-decoration: none;
        }

        /* Responsive Design for Tablets */
        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
                padding-bottom: 20px;
                max-height: 100vh;
                overflow-y: auto;
            }

            .section-container {
                padding: 20px;
            }

            .package-info-section {
                padding: 20px;
            }

            .section-title {
                font-size: 1.3rem;
            }

            .fixed-button-container {
                padding: 15px 20px;
                flex-direction: column-reverse;
            }

            .submit-btn,
            .cancel-btn {
                width: 100%;
                padding: 12px 20px;
            }

            .editor-toolbar {
                padding: 6px;
            }

            .editor-toolbar button {
                padding: 5px 8px;
                font-size: 0.9rem;
            }
        }

        /* Responsive Design for Mobile Devices */
        @media (max-width: 576px) {
            .main-content {
                padding: 20px;
                padding-bottom: 20px;
                max-height: 100vh;
                overflow-y: auto;
            }

            .section-container {
                padding: 15px;
                margin-bottom: 15px;
            }

            .package-info-section {
                padding: 15px;
            }

            .item-card {
                padding: 15px;
            }

            .section-title {
                font-size: 1.2rem;
            }

            .add-new-btn {
                width: 100%;
                justify-content: center;
                padding: 10px 20px;
            }

            .editor-content {
                min-height: 100px;
            }

            .fixed-button-container {
                padding: 12px 15px;
            }

            .item-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .delete-btn {
                align-self: flex-end;
            }
        }

        /* Smooth Scrolling */
        .main-content {
            scroll-behavior: smooth;
        }

        /* Custom Scrollbar */
        .main-content::-webkit-scrollbar {
            width: 8px;
        }

        .main-content::-webkit-scrollbar-track {
            background: var(--bg-light);
        }

        .main-content::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
        }

        .main-content::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
    </style>
</head>

<body>

    <?php
    // Get package ID from URL
    $packageID = $_GET['packageID'] ?? '';
    $marketplaceServiceID = $_GET['marketplaceServiceID'] ?? '';
    ?>

    <!-- Main Scrollable Content Area -->
    <div class="main-content" id="mainContent">

        <!-- Package Information Section -->
        <div class="package-info-section">
            <div class="row g-3">
                <!-- Marketplace Name Input -->
                <div class="col-md-6">
                    <label class="form-label">Marketplace Name</label>
                    <input type="text" class="form-control" value="Instagram" placeholder="Enter marketplace name" disabled>
                </div>

                <!-- Package Name Input -->
                <div class="col-md-6">
                    <label class="form-label">Package Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" name="package_name" placeholder="Enter package name" required>
                </div>
            </div>
        </div>

        <!-- Descriptions Section - Separate Container -->
        <div class="section-container">
            <h2 class="section-title">
                <i class="fas fa-align-left"></i>
                Add Descriptions
            </h2>

            <!-- Descriptions Container - Dynamic Items Added Here -->
            <div id="descriptionsContainer">
                <!-- Initial Description Item -->
                <div class="item-card" data-item-type="description">
                    <div class="item-header">
                        <span class="item-label">Description 1</span>
                        <button type="button" class="delete-btn" onclick="deleteItem(this)" title="Delete Description">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <!-- Description Heading Input -->
                    <div class="mb-3">
                        <label class="form-label">Description Heading</label>
                        <input type="text" class="form-control" placeholder="Enter heading...">
                    </div>

                    <!-- Rich Text Editor for Description Details -->
                    <div>
                        <label class="form-label">Description Details</label>
                        <div class="editor-toolbar">
                            <button type="button" title="Bold" data-command="bold">
                                <i class="fas fa-bold"></i>
                            </button>
                            <button type="button" title="Italic" data-command="italic">
                                <i class="fas fa-italic"></i>
                            </button>
                            <button type="button" title="Underline" data-command="underline">
                                <i class="fas fa-underline"></i>
                            </button>
                            <button type="button" title="Bullet List" data-command="insertUnorderedList">
                                <i class="fas fa-list-ul"></i>
                            </button>
                            <button type="button" title="Numbered List" data-command="insertOrderedList">
                                <i class="fas fa-list-ol"></i>
                            </button>
                        </div>
                        <div class="editor-content" contenteditable="true" placeholder="Start typing..."></div>
                    </div>
                </div>
            </div>

            <!-- Add New Description Button -->
            <button type="button" class="add-new-btn" onclick="addNewItem('description')">
                <i class="fas fa-plus"></i>
                Add New Description
            </button>
        </div>

        <!-- Services Section - Separate Container -->
        <div class="section-container">
            <h2 class="section-title">
                <i class="fas fa-star"></i>
                Add Services
            </h2>

            <!-- Services Container - Dynamic Items Added Here -->
            <div id="servicesContainer">
                <!-- Initial Service Item -->
                <div class="item-card" data-item-type="service">
                    <div class="item-header">
                        <span class="item-label">Service 1</span>
                        <button type="button" class="delete-btn" onclick="deleteItem(this)" title="Delete Service">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <!-- Service Heading Input -->
                    <div class="mb-3">
                        <label class="form-label">Service Heading</label>
                        <input type="text" class="form-control" placeholder="Enter service heading...">
                    </div>

                    <!-- Rich Text Editor for Service Description -->
                    <div>
                        <label class="form-label">Service Description</label>
                        <div class="editor-toolbar">
                            <button type="button" title="Bold" data-command="bold">
                                <i class="fas fa-bold"></i>
                            </button>
                            <button type="button" title="Italic" data-command="italic">
                                <i class="fas fa-italic"></i>
                            </button>
                            <button type="button" title="Underline" data-command="underline">
                                <i class="fas fa-underline"></i>
                            </button>
                            <button type="button" title="Bullet List" data-command="insertUnorderedList">
                                <i class="fas fa-list-ul"></i>
                            </button>
                            <button type="button" title="Numbered List" data-command="insertOrderedList">
                                <i class="fas fa-list-ol"></i>
                            </button>
                        </div>
                        <div class="editor-content" contenteditable="true" placeholder="Start typing..."></div>
                    </div>
                </div>
            </div>

            <!-- Add New Service Button -->
            <button type="button" class="add-new-btn" onclick="addNewItem('service')">
                <i class="fas fa-plus"></i>
                Add New Service
            </button>
        </div>

    </div>

    <!-- Fixed Submit Button Container at Bottom Right -->
    <div class="fixed-button-container">
        <a href="index.php?RequestFarward=EditPacakges&packageID=<?= $packageID ?>&marketplaceServiceID=<?= $marketplaceServiceID ?>" class="cancel-btn">
            Return Back
        </a>
        <button type="button" class="submit-btn" onclick="handleSubmit()">
            <i class="fa-solid fa-arrow-right"></i> Procede Next
        </button>
    </div>

    <!-- Hidden form for data submission -->
    <form id="packageForm" method="POST" action="index.php" style="display: none;">
        <input type="hidden" name="marketplaceID" value="<?= $packageID ?>">
        <input type="hidden" name="marketplaceServiceID" value="<?= $marketplaceServiceID ?>">
        <input type="hidden" name="package_name" id="hiddenPackageName">
        <input type="hidden" name="services_features" id="hiddenServicesFeatures">
        <div id="descriptionsData"></div>
        <div id="servicesData"></div>
        <input type="hidden" name="package_details" value="1">
    </form>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Counter for tracking number of descriptions and services
        let descriptionCount = 1;
        let serviceCount = 1;

        /**
         * Add a new description or service item dynamically
         * @param {string} type - Either 'description' or 'service'
         */
        function addNewItem(type) {
            const container = type === 'description' ?
                document.getElementById('descriptionsContainer') :
                document.getElementById('servicesContainer');

            // Increment counter based on type
            const count = type === 'description' ? ++descriptionCount : ++serviceCount;
            const label = type === 'description' ? 'Description' : 'Service';
            const headingPlaceholder = type === 'description' ?
                'Enter heading...' :
                'Enter service heading...';
            const detailsLabel = type === 'description' ?
                'Description Details' :
                'Service Description';

            // Create new item card HTML
            const newItem = document.createElement('div');
            newItem.className = 'item-card';
            newItem.setAttribute('data-item-type', type);
            newItem.innerHTML = `
                <div class="item-header">
                    <span class="item-label">${label} ${count}</span>
                    <button type="button" class="delete-btn" onclick="deleteItem(this)" title="Delete ${label}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">${label} Heading</label>
                    <input type="text" class="form-control" placeholder="${headingPlaceholder}">
                </div>
                
                <div>
                    <label class="form-label">${detailsLabel}</label>
                    <div class="editor-toolbar">
                        <button type="button" title="Bold" data-command="bold">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button type="button" title="Italic" data-command="italic">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button type="button" title="Underline" data-command="underline">
                            <i class="fas fa-underline"></i>
                        </button>
                        <button type="button" title="Bullet List" data-command="insertUnorderedList">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button type="button" title="Numbered List" data-command="insertOrderedList">
                            <i class="fas fa-list-ol"></i>
                        </button>
                    </div>
                    <div class="editor-content" contenteditable="true" placeholder="Start typing..."></div>
                </div>
            `;

            // Add new item to container with smooth animation
            container.appendChild(newItem);

            // Initialize editor for the new item
            initializeEditor(newItem);

            // Smooth scroll to the newly added item
            setTimeout(() => {
                newItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }

        /**
         * Initialize editor functionality for an item
         * @param {HTMLElement} item - The item card element
         */
        function initializeEditor(item) {
            const toolbar = item.querySelector('.editor-toolbar');
            const editor = item.querySelector('.editor-content');

            // Add click event to toolbar buttons
            toolbar.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', function() {
                    const command = this.getAttribute('data-command');
                    formatText(editor, command);
                });
            });

            // Add placeholder functionality
            editor.addEventListener('focus', function() {
                if (this.textContent === 'Start typing...') {
                    this.textContent = '';
                }
            });

            editor.addEventListener('blur', function() {
                if (this.textContent.trim() === '') {
                    this.textContent = 'Start typing...';
                }
            });
        }

        /**
         * Format text in the editor
         * @param {HTMLElement} editor - The editor element
         * @param {string} command - The formatting command
         */
        function formatText(editor, command) {
            // Focus the editor first
            editor.focus();
            
            try {
                // Use document.execCommand for formatting
                document.execCommand(command, false, null);
            } catch (e) {
                console.warn('execCommand not supported:', e);
                // Fallback for modern browsers that don't support execCommand
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const selectedText = range.toString();
                    
                    if (selectedText) {
                        let formattedText = selectedText;
                        
                        switch (command) {
                            case 'bold':
                                formattedText = `<strong>${selectedText}</strong>`;
                                break;
                            case 'italic':
                                formattedText = `<em>${selectedText}</em>`;
                                break;
                            case 'underline':
                                formattedText = `<u>${selectedText}</u>`;
                                break;
                        }
                        
                        // Replace the selected text with formatted text
                        range.deleteContents();
                        range.insertNode(document.createRange().createContextualFragment(formattedText));
                    }
                }
            }
        }

        /**
         * Delete an item (description or service)
         * @param {HTMLElement} button - The delete button element
         */
        function deleteItem(button) {
            const itemCard = button.closest('.item-card');
            const itemType = itemCard.getAttribute('data-item-type');
            const container = itemCard.parentElement;

            // Check if this is the last item
            const items = container.querySelectorAll('.item-card');

            if (items.length === 1) {
                alert(`You must have at least one ${itemType}!`);
                return;
            }

            // Confirm deletion
            if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
                // Fade out animation before removal
                itemCard.style.transition = 'opacity 0.3s ease';
                itemCard.style.opacity = '0';

                setTimeout(() => {
                    itemCard.remove();
                    // Update numbering after deletion
                    updateItemNumbers(itemType);
                }, 300);
            }
        }

        /**
         * Update item numbers after deletion
         * @param {string} type - Either 'description' or 'service'
         */
        function updateItemNumbers(type) {
            const container = type === 'description' ?
                document.getElementById('descriptionsContainer') :
                document.getElementById('servicesContainer');

            const items = container.querySelectorAll('.item-card');
            const label = type === 'description' ? 'Description' : 'Service';

            items.forEach((item, index) => {
                const itemLabel = item.querySelector('.item-label');
                itemLabel.textContent = `${label} ${index + 1}`;
            });

            // Update counter
            if (type === 'description') {
                descriptionCount = items.length;
            } else {
                serviceCount = items.length;
            }
        }

        /**
         * Handle form submission
         */
        function handleSubmit() {
            // Get basic form data - ONLY package name now
            const packageName = document.querySelector('input[name="package_name"]').value;

            // Validate required field
            if (!packageName) {
                alert('Please enter a package name!');
                return;
            }

            // Collect descriptions
            const descriptions = [];
            const descriptionCards = document.querySelectorAll('#descriptionsContainer .item-card');
            descriptionCards.forEach(card => {
                const heading = card.querySelector('input[placeholder*="heading"]').value;
                const details = card.querySelector('.editor-content').innerHTML;
                if (heading && details && details !== 'Start typing...') {
                    descriptions.push({
                        heading,
                        details
                    });
                }
            });

            // Collect services
            const services = [];
            const serviceCards = document.querySelectorAll('#servicesContainer .item-card');
            serviceCards.forEach(card => {
                const heading = card.querySelector('input[placeholder*="heading"]').value;
                const description = card.querySelector('.editor-content').innerHTML;
                if (heading && description && description !== 'Start typing...') {
                    services.push({
                        heading,
                        description
                    });
                }
            });

            // Set hidden form values
            document.getElementById('hiddenPackageName').value = packageName;
            document.getElementById('hiddenServicesFeatures').value = 'Services Features';

            // Create hidden inputs for descriptions
            const descriptionsDataDiv = document.getElementById('descriptionsData');
            descriptionsDataDiv.innerHTML = '';
            descriptions.forEach((desc, index) => {
                const headingInput = document.createElement('input');
                headingInput.type = 'hidden';
                headingInput.name = `descriptions[${index}][heading]`;
                headingInput.value = desc.heading;
                
                const detailsInput = document.createElement('input');
                detailsInput.type = 'hidden';
                detailsInput.name = `descriptions[${index}][details]`;
                detailsInput.value = desc.details;
                
                descriptionsDataDiv.appendChild(headingInput);
                descriptionsDataDiv.appendChild(detailsInput);
            });

            // Create hidden inputs for services
            const servicesDataDiv = document.getElementById('servicesData');
            servicesDataDiv.innerHTML = '';
            services.forEach((service, index) => {
                const headingInput = document.createElement('input');
                headingInput.type = 'hidden';
                headingInput.name = `services[${index}][heading]`;
                headingInput.value = service.heading;
                
                const descriptionInput = document.createElement('input');
                descriptionInput.type = 'hidden';
                descriptionInput.name = `services[${index}][description]`;
                descriptionInput.value = service.description;
                
                servicesDataDiv.appendChild(headingInput);
                servicesDataDiv.appendChild(descriptionInput);
            });

            // Submit the form
            document.getElementById('packageForm').submit();
        }

        // Initialize editors for existing items on page load
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.item-card').forEach(item => {
                initializeEditor(item);
            });
        });

        // Prevent accidental page navigation
        window.addEventListener('beforeunload', function(e) {
            e.preventDefault();
            e.returnValue = '';
        });
    </script>
</body>

</html>