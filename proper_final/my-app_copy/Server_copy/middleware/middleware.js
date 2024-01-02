const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenKey = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
  } else {
    return res
      .status(401)
      .send({ message: `Authentication error. Token required.` });
  }
};

module.exports = verifyTokenKey;
