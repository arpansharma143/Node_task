const fs = require("fs");
fs.readFile("log.txt", (err, data) => {
  if (err) {
    console.log("somethig went to wrong ");
    return;
  }
  console.log(data.toString());
});

fs.writeFile("log.txt", "hello i m writing file by node", (err) => {
  if (err) {
    console.log("something went wrong ");
  } else {
    console.log("wrote to fiel");
  }
});
