const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    console.log("enter to get method");
    res.setHeader("Content-Type", "text/html");
    res.write(
      ` <h1> HI Unknown user </h1><form method="POST" action="/"> <input name="username" type="text">   <button type="submit">send</button>   </form> `
    );
    res.end();
  } else if (req.method === "POST" ) {
    console.log("post method");
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      body = Buffer.concat(body).toString();
      let username = body ? body.split("=")[1] : "unknown user ";
      res.setHeader("Content-type", "text/html");
      res.write(
        ` <h1>HI ${username} <h1> <form method="POST" action="/"> <input type="text" name=username > <button>send </button> </from>`
      );
      res.end();
    });
  }
});

server.listen(3000);
