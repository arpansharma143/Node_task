var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";

const usersave = async (req, res) => {
  let userInfoColl_id;
  const { firstName, lastName, city, gender, eMail } = req.body;
  const { addressInfo } = req.body;
  const parsedaddressinfo = JSON.parse(addressInfo);
  const path = req.file.path;

  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("nodeTask_4");
    const id = await dbo
      .collection("user")
      .insertOne({ firstName, lastName, city, gender, eMail, path });
    userInfoColl_id = id.insertedId;

    dbo
      .collection("userAddress")
      .insertOne({ ...parsedaddressinfo, userInfoColl_id });
  });
  res.send({ status: 200, msg: "uploaded succesfully" });
};

module.exports = usersave;
