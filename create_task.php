<?php

//read from POST - might need to be @file_get_contents('php://input') instead
$json = http_get_request_body();

$obj = json_decode($json);

// new data
$label = $obj->{'label'};//'Buy milk';
$date = $obj->{'date'};//'2013-03-06';
$duration = $obj->{'duration'};//'5';
$done = '0';// not done when created, ignore json

// database connection
//TODO factor this out into its own file, along with from data.php






// create
$db = new PDO("sqlite:sample.db");

// query
$sql = "INSERT INTO task (label,date,duration,done) VALUES (:label,:date,:duration,:done)";
$insert = $db->prepare($sql);
$success = $insert->execute(array(':label'=>$label,
                  ':date'=>$date,
                  ':duration'=>$duration,
                  ':done'=>$done));

if ($success) {
    echo "{'status':'ok'}";
} else {
    $res = array(
        "status" => "error",
        "message" => $insert->errorInfo(),
    );
    echo json_encode($res);
}
?>
