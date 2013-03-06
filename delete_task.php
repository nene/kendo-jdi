<?php
require_once("db.php");

//read from POST
$json = @file_get_contents('php://input');

$obj = json_decode($json);

// ID of the record to delete
$id = $obj->{'id'};//'5';


// query
$sql = "DELETE FROM task WHERE id = :id";
$delete = $db->prepare($sql);
$success = $delete->execute(array(':id'=>$id));

if ($success) {
    echo "{'status':'ok'}";
} else {
    $res = array(
        "status" => "error",
        "message" => $delete->errorInfo(),
    );
    echo json_encode($res);
}
?>
