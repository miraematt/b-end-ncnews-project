const { fetchUserById, fetchAllUsers } = require("../models/users");

exports.sendUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "No user found for this username"
        });
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.sendAllUsers = (req, res, next) => {
  fetchAllUsers(req.query)
    .then(users => {
      // if (req.query.sort_by === "" || req.query.order === "") {
      //   return Promise.reject({
      //     status: 400,
      //     msg:
      //       "Sort property or order property have been chosen but invalid values have been given"
      //   });
      // }
      // if (articles.length === 0 && req.query.topic) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: "There are no matches for this topic"
      //   });
      // }
      // if (articles.length === 0 && req.query.author) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: "There are no matches for this author"
      //   });
      // }
      // const orderValues = ["asc", "desc"];
      // if (req.query.order) {
      //   if (!orderValues.includes(req.query.order)) {
      //     return Promise.reject({
      //       status: 400,
      //       msg:
      //         "Sort property or order property have been chosen but invalid values have been given"
      //     });
      //   }
      // }
      res.status(200).send({ users });
    })
    .catch(next);
};
