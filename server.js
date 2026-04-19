const http = require("http");
const fs = require("fs");
const path = require("path");

let products = {
    //Men
    "Running Shoes": 10,
    "Casual Watch": 8,
    "Mens T-Shirt": 20,
    "Slim Fit Jeans": 15,
    "Bomber Jacket": 10,
    "Sunglasses": 12,
    "Leather Wallet": 18,

    //Women
    "Floral Kurti": 15,
    "Silk Saree": 8,
    "Designer Handbag": 10,
    "Block Heels": 12,
    "Gold Earrings": 20,
    "Embroidered Dupatta": 15,
    "Skincare Kit": 10,

    //Kids
    "Books": 2,
    "Racket": 2,
    "LEGO Set": 10,
    "School Backpack": 14,
    "Kids Bicycle": 7,
    "Art Craft Kit": 16,
    "Jigsaw Puzzle": 18
};

http.createServer(function (req, res) {

    let file = req.url;

    if (file === "/") {
        file = "index.html";
    } else {
        file = file.substring(1);
    }

    let ext = path.extname(file);

    let contentType = "text/html";

    if (ext === ".css") contentType = "text/css";
    else if (ext === ".js") contentType = "text/javascript";
    else if (ext === ".jpg") contentType = "image/jpeg";
    else if (ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".mp4") contentType = "video/mp4";

    let filePath = path.join(__dirname, file);

    if (req.url.startsWith("/buy")) {

        let url = new URL(req.url, `http://${req.headers.host}`);

        let item = url.searchParams.get("item");
        let qty = parseInt(url.searchParams.get("qty"));

        if (!products[item] || products[item] < qty) {
            res.writeHead(200);
            res.end("OUT_OF_STOCK");
            return;
        }

        products[item] -= qty;

        res.writeHead(200);
        res.end("SUCCESS");
        return;
    }

    fs.readFile(filePath, function (err, data) {

        res.writeHead(200, {
            "Content-Type": contentType + "; charset=utf-8"
        });

        res.end(data);

    });

}).listen(5050);

console.log("Server running at http://localhost:5050");