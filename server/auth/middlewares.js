const User = require("./User");
const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
const isProfile = (req, res, next) => {
  if(req.params.id == req.user.id){
    next();
  } else {
    res.status(401).send("You dont have access!");
  }
}
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access forbidden");
  }
};
const isNotBlocked = async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})
  if(!user){
    res.status(403).send("Пользователь не зарегистрирован");
  } else if(user && !user.isBlocked){
    next();
  } else{
    res.status(403).send("Пользователь заблокирован");
  }
}
module.exports = { isAuth, isAdmin, isProfile,isNotBlocked };
