<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo "You need to log in to create a post.";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)");
    if ($stmt->execute([$user_id, $title, $content])) {
        echo "Post created successfully!";
    } else {
        echo "Failed to create post.";
    }
}
?>

<form method="POST">
    <input type="text" name="title" placeholder="Post Title" required>
    <textarea name="content" placeholder="Post Content" required></textarea>
    <button type="submit">Create Post</button>
</form>
