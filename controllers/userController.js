const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Orders");

require("dotenv").config();

const handleErrors = (err) => {};

const maxAge = 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUpGet = (req, res) => {
  res.render("signUp");
};
module.exports.signInGet = (req, res) => {
  //   if(req.cookies.jwtSignIn) res.redirect('/')

  res.render("signIn");
};

module.exports.signUpPost = async (req, res) => {
  console.log("soidfjiodfj");
  let userName = req.body.userName;
  let phone = req.body.userPhone;
  let userType = req.body.userType;
  let password = req.body.userPassword;
  console.log(userName, phone, password);

  try {
    const user = await User.create({ userName, phone, userType, password });
    const token = createToken(user._id);
    console.log("Token", user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    });
    res.status(201).json({ user });
  } catch (e) {
    console.log("Errors", e);
    res.status(400).json("ERRORS CAUGHT", e);
  }
};

module.exports.signInPost = async (req, res) => {
  const { userPhone, userPassword } = req.body;

  if (req.cookies.jwtSignIn) res.redirect("/");
  try {
    const user = await User.login(userPhone, userPassword);
    console.log("GOT USER ->", user);
    if (user == null || undefined || "") res.json(null);
    else {
      const token = createToken(user._id);
      res.cookie("jwtSignIn", token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false,
      });
      res.json({ user: user });
    }
  } catch (e) {
    console.log(e, "Error signIn");
    res.status(404).json({ e });
  }
};

module.exports.signOutGet = (req, res) => {
  res.cookie("jwtSignIn", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.workerDashboardPost = (req, res) => {
  console.log('------------------------------------------->');
  var data = req.body.wName;
  console.log(data);
  let wName=data.toLowerCase()

  Order.find({ deliveryPerson: { $in: wName } }, (err, results) => {
    if (err) console.log("alldata error", err);
    else {
      res.render("workerDashboard", {
        title: "Worker Dashboard",
        allData: results,
        user:wName
      });
    }
  });
};
