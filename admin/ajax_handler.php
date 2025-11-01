<?php
include '../includes/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        
        $db = new backend();
        
        if ($action === 'get_marketplaces') {
            $marketplaces = $db->fetching('marketplaces', 'id, marketplace_name');
            
            if ($marketplaces) {
                echo '<option value="" selected disabled>Select Marketplace</option>';
                foreach ($marketplaces as $marketplace) {
                    echo '<option value="' . $marketplace['id'] . '">' . $marketplace['marketplace_name'] . '</option>';
                }
            } else {
                echo '<option value="" selected disabled>No marketplaces found</option>';
            }
        } elseif ($action === 'get_packages' && isset($_POST['marketplace_id'])) {
            $marketplace_id = $_POST['marketplace_id'];
            $packages = $db->fetching(
                'marketplace_services', 
                'id, package_name', 
                null, 
                "marketplace_id = '$marketplace_id'"
            );
            
            if ($packages) {
                echo '<option value="" selected disabled>Select Package</option>';
                foreach ($packages as $package) {
                    echo '<option value="' . $package['id'] . '">' . $package['package_name'] . '</option>';
                }
            } else {
                echo '<option value="" selected disabled>No packages found</option>';
            }
        }
    }
    exit();
}
?>