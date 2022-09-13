const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let fileToSend;
  let statusCodeToSend;
  if (req.url === "/" || req.url === "/home") {
    (fileToSend = "./FrontEnd/index.html"), (statusCodeToSend = 200);
  } else if (req.url === "/about") {
    (fileToSend = "./FrontEnd/about.html"), (statusCodeToSend = 200);
  } else if (req.url === "/term") {
    (fileToSend = "./FrontEnd/term.html"), (statusCodeToSend = 200);
  } else {
    (fileToSend = "./FrontEnd/error404.html"), (statusCodeToSend = 404);
  }
  fs.readFile(fileToSend, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    res.writeHead(statusCodeToSend, { "Content-type": "text/html" });
    return res.end(data, "utf-8");
  });
});

server.listen(3000);
