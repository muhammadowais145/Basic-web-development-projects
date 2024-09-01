<?php
include 'db.php';

$stmt = $pdo->query("SELECT * FROM posts");
$posts = $stmt->fetchAll();

foreach ($posts as $post) {
    echo "<h2>" . htmlspecialchars($post['title']) . "</h2>";
    echo "<p>" . htmlspecialchars($post['content']) . "</p>";
    echo "<small>Posted on " . $post['created_at'] . "</small><hr>";
}
?>
