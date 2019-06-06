const { fetchUserById } = require("../models/users");

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
