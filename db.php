<?php
// Establish database connection.
$db = new PDO('sqlite:sample.db');

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
