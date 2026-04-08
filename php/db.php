<?php
$host = "localhost";
$dbname = "ngek9n";
$username = "ngek9n";
$password = "Geza1985!";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Kapcsolódás sikeres";
} catch (PDOException $e) {
    die("Adatbázis kapcsolat hiba: " . $e->getMessage());
}
?>