import http from "http";
import formidable from "formidable";
import fs from "fs";
var url = "mongodb://localhost:27017";
import { MongoClient } from "mongodb";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "multipart/form-data");
  if (req.url === "/" && req.method === "GET") {
    fs.readFile("./Views/index.html", (err, data) => {
      if (err) {
        return console.log(err);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      console.log(data);
      res.end(data, "utf-8");
    });
  }

  if (req.url === "/savePost" && req.method === "POST") {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      
      var newName = files.file.originalFilename;
      var oldPath = files.file.filepath;
      var newPath = `./Public/Uploads/${newName}`;

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("uplaoded picture");
        }
      });
      const userFields = fields;

      userFields["imgPath"] = newPath;

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("NodeTest_3_part_2");
        dbo.collection("users").insertOne(userFields, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });

      const resobj = {
        status: 200,
        msg: "upploaded successfully",
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resobj));
    });

    // const json = JSON.stringify(resobj);
    return;
  }
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
