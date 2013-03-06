<?php
// Establish database connection.

// Creates our tasks table when it doesn't exist yet.
function init_database($db) {
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
}

$db = new PDO('sqlite:sample.db');
init_database($db);
