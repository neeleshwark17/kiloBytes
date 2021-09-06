const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

const maxAge = 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.adminSignInGet = (req, res) => {
  console.log("currentUser---------->");
  if (req.cookies.isAdmin) {
    res.redirect("/adminDashboard");
  } else {
    signOut(res)
    res.render("adminLogin", {
      title: "Admin Login",
    });
  }
};

module.exports.adminDashboard = (req, res) => {
  console.log(">>>>>>>>>>>>COOKIES PRESENT");
  User.find({ userType: { $in: ["customer", "worker"] } }, (err, results) => {
    if (err) console.log("alldata error", err);
    else {
      res.render("adminDashboard", {
        title: "Admin Dashboard",
        user: "Admin",
        allData: results,
      });
    }
  });
};

module.exports.adminSignInPost = async (req, res) => {
  if (req.cookies.jwtSignIn) res.redirect("/adminDashboard");

  let adminPhone = req.body.adminPhone;
  let adminPassword = req.body.adminPassword;

  console.log(adminPhone, adminPassword);

  try {
    const admin = await User.login(adminPhone, adminPassword);
    // console.log("GOT USER ->", admin);
    if (admin) {
      User.find(
        { userType: { $in: ["customer", "worker"] } },
        (err, results) => {
          if (err) console.log("alldata error", err);
          else {
            const token = createToken(admin._id);
            res.cookie("jwtSignIn", token, {
              maxAge: 1000 * 60 * 60,
              httpOnly: true,
              secure: false,
            });
            res.cookie("isAdmin", {
              maxAge: 1000 * 60 * 60,
              httpOnly: true,
              secure: false,
            });
            console.log("GIBBERISH-------->", results);

            res.render("adminDashboard", {
              title: "Admin Dashboard",
              user: admin,
              allData: results,
            });
          }
        }
      );
    }
  } catch (e) {
    console.log(e, "Error signIn");
    res.status(404).json({ e });
  }
};

module.exports.addWorkerGet = (req, res) => {
  res.render("addWoker");
};

module.exports.addWorkerPost = async (req, res) => {
  let userName = req.body.workerName;
  let phone = req.body.workerPhone;
  let userType = "worker";
  let password = req.body.workerPassword;
  console.log(">>>>>>>>>>>>>>>>>>>", userName, phone, userType, password);
  try {
    const worker = await User.create({ userName, phone, userType, password });
    console.log("Worker added success ", worker);
    res.redirect("/addWorkerGet");
  } catch (e) {
    console.log("WORKER not added", e);
  }
};

module.exports.adminSignOutGet=(req,res)=>{
    res.cookie("jwtSignIn", "", { maxAge: 1 });
    res.cookie("isAdmin", "", { maxAge: 1 });
    res.redirect("/");
}
function signOut(res){
    res.cookie("jwtSignIn", "", { maxAge: 1 });
    res.redirect("/");
}