<?php
require_once("db.php");

$statement = $db->prepare('SELECT * FROM task');
$statement->execute();
$products = $statement->fetchAll(PDO::FETCH_ASSOC);

// Set response content type
header('Content-Type: application/json');


// Return JSON
echo json_encode($products);
?>
