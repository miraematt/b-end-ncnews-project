const connection = require("../db/connection");

exports.fetchUserById = username => {
  return connection("users").where("username", username);
};
