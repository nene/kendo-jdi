<?php
require_once("db.php");

//read from POST
$json = @file_get_contents('php://input');

$obj = json_decode($json);

// new data
$id = $obj->{'id'};//'5';
$label = $obj->{'label'};//'Buy milk';
$date = $obj->{'date'};//'2013-03-06';
$duration = $obj->{'duration'};//'5';
$done = $obj->{'done'};// not done when created, ignore json


// query
$sql = "UPDATE task SET id=:id, label=:label, date=:date, duration=:duration, done=:done";
$update = $db->prepare($sql);
$success = $update->execute(array(
                  ':id'=>$id,
                  ':label'=>$label,
                  ':date'=>$date,
                  ':duration'=>$duration,
                  ':done'=>$done));

if ($success) {
    echo "{'status':'ok'}";
} else {
    $res = array(
        "status" => "error",
        "message" => $update->errorInfo(),
    );
    echo json_encode($res);
}
?>
