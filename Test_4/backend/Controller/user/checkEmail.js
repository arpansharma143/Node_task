var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/mydb";

const checkEmail = async (req, res, next) => {
  

  const client = new MongoClient(url);

  const database = client.db("nodeTask_4");

  const users = database.collection("user");
 
  let isuserexists = await users.findOne({ eMail: req.body.email });

  if (isuserexists) {
    res
      .status(400)
      .send({
        status: false,
        msg: "user  exists please try some another email",
      });
    return;
  } else {
    res.status(200).send({ status: true, msg: "user does not exists" });
    next();
  }
};

module.exports = checkEmail;
