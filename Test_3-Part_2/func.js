import { MongoClient } from "mongodb";
var url = "mongodb://localhost:27017";
import fs from "fs";

export const duplicate = async (email) => {
  const client = new MongoClient(url);

  const database = client.db("Node_test_3");

  const users = database.collection("users");

  let isExist = await users.findOne({ eMail: email });

  console.log(isExist, "in91");
  return isExist;
};

export const checkFileType = (files) => {
  if (
    files?.file?.mimetype?.split("/").pop() === "jpeg" ||
    files?.file?.mimetype?.split("/").pop() === "png"
  ) {
    return true;
  }
  return false;
};

export function allLetter(inputtxt) {
  var letters = /^[A-Za-z]+$/;
  if (inputtxt.match(letters)) {
    return true;
  } else {
    return false;
  }
}
