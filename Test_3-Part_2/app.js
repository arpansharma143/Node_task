import http from "http";
import formidable from "formidable";
import fs from "fs";
var url = "mongodb://localhost:27017";
import { MongoClient } from "mongodb";
import { duplicate, checkFileType, allLetter } from "./func.js";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.setHeader("Content-Type", "multipart/form-data");
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

    form.parse(req, async (err, fields, files) => {
      const { firstName, lastName, age, city, gender, eMail } = fields;
      // checking the file type
      if (!checkFileType(files)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: 400,
            msg: "file should be jpeg and png type ",
          })
        );
        return;
      }

      // validating the firstname and last name

      if (!allLetter(firstName)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: 400,
            msg: "firstname Fields  contain only  a to z letter ",
          })
        );

        return;
      }
      if (!allLetter(lastName)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: 400,
            msg: "lastname Fields  contain only  a to z letter",
          })
        );

        return;
      }

      // checking the duplicate email

      const isExist = await duplicate(eMail);

      console.log(isExist, "in 100");

      if (isExist) {
        console.log("user exist condition true");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: 400,
            msg: "user exists",
          })
        );
        return;
      }

      //start uploading file///////////////////////////////

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

      console.log("Inside working");
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Node_test_3");
        dbo.collection("users").insertOne(
          {
            ...userFields,
            age: parseInt(userFields["age"]),
            imgPath: newPath,
          },
          function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          }
        );
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: 200,
          msg: "upploaded successfully",
        })
      );
    });

    return;
  }
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
