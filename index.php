<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

</head>
<body>
    <div class="container">
        <header class="header-content background-color">
            <img src="AnchorzUp_Logo.svg" alt="Logo" width="200" height="40">
        </header>
        <main class="main-content">
            <h1>URL Shortener</h1>
            <form>
                <input type="url" name="url" placeholder="Paste the URL to be shortened">
                <button type="submit" style="color:white; font-size: 13px">Shorten URL</button>
              <div class="custom-select">
  <div class="select-selected">Add Expiration Date</div>
  <div class="select-items select-hide">
    <div data-value="1">1 minute</div>
    <div data-value="2">5 minutes</div>
    <div data-value="3">30 minutes</div>
    <div data-value="4">1 hour</div>
    <div data-value="5">5 hours</div>
  </div>
</div>
            </form>
        </main>
        <aside class="aside-content background-color">
                <h2>My shortened URLs</h2>
        </aside>
    </div>
    <script src="script.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</body>
</html>