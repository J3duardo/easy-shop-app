const jwt = require("jsonwebtoken");

const checkRole = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  
  if(!tokenHeader) {
    return res.status(401).json({
      status: "failed",
      msg: "You need to be logged as admin to access this resource"
    })
  }

  const token = tokenHeader.split(" ")[1];
  const decoded = jwt.decode(token);

  if(!decoded.isAdmin) {
    return res.status(401).json({
      status: "failed",
      msg: "Only admin users can access this resource"
    })
  }

  next();
}

module.exports = checkRole;