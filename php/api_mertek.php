<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {
    case "GET":
        getItems($pdo);
        break;

    case "POST":
        createItem($pdo);
        break;

    case "PUT":
        updateItem($pdo);
        break;

    case "DELETE":
        deleteItem($pdo);
        break;

    default:
        echo json_encode(["message" => "Nem támogatott metódus"]);
        break;
}

function getItems($pdo) {
    $stmt = $pdo->query("SELECT * FROM mertek ORDER BY id ASC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items, JSON_UNESCAPED_UNICODE);
}

function createItem($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["nev"]) || trim($data["nev"]) === "") {
        echo json_encode(["message" => "Hiányzó név"]);
        return;
    }

    $stmt = $pdo->prepare("INSERT INTO mertek (nev) VALUES (:nev)");
    $stmt->execute([
        ":nev" => trim($data["nev"])
    ]);

    echo json_encode(["message" => "Sikeres hozzáadás"]);
}

function updateItem($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data["id"]) ||
        !isset($data["nev"]) ||
        trim($data["nev"]) === ""
    ) {
        echo json_encode(["message" => "Hiányzó adatok"]);
        return;
    }

    $stmt = $pdo->prepare("UPDATE mertek SET nev = :nev WHERE id = :id");
    $stmt->execute([
        ":nev" => trim($data["nev"]),
        ":id" => $data["id"]
    ]);

    echo json_encode(["message" => "Sikeres módosítás"]);
}

function deleteItem($pdo) {
    if (!isset($_GET["id"])) {
        echo json_encode(["message" => "Hiányzó azonosító"]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM mertek WHERE id = :id");
    $stmt->execute([
        ":id" => $_GET["id"]
    ]);

    echo json_encode(["message" => "Sikeres törlés"]);
}
?>