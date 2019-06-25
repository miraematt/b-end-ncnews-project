const connection = require("../db/connection");

exports.fetchUserById = username => {
  return connection("users").where("username", username);
};

exports.fetchAllUsers = () => {
  return connection.select("username", "avatar_url", "name").from("users");
};
