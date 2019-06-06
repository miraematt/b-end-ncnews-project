const connection = require("../db/connection");

exports.fetchAllTopics = () => {
  return connection.select("slug", "description").from("topics");
};
