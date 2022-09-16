const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
const addresss = async (req, res) => {
  const client = new MongoClient(url);
  const database = client.db("nodeTask_4");
  const countryNames = database.collection("countryNames");
  const countrydata = await countryNames.findOne({});
  res.send({ status: 200, countryList: countrydata.countryList });
};

module.exports = addresss;
