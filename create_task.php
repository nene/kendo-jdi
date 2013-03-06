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

// create
$db = new PDO("sqlite:sample.db");

//TODO factor this out into its own file, along with from data.php
// When our table doesn't yet exist
if (!$db->query('SELECT * FROM task LIMIT 1')) {
  $db->exec('CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, date DATE, duration INT, done SMALLINT);');
  // pull in data
  $data = json_decode(file_get_contents("data.json"), true);
  $insert = $db->prepare("INSERT INTO task (label, date, duration, done) VALUES (:label, :date, :duration, :done)");
  foreach ($data as $row) {
    $r = array(":label" => $row["label"], ":date" => $row["date"], ":duration" => $row["duration"], ":done" => $row["done"]);
    $insert->execute($r);
  }
}



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
