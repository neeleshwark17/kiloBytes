const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userController = require("../controllers/userController");
const adminController=require('../controllers/adminController')
const session = require("express-session");

const { checkUser, requireAuth } = require("../middelware/middleware");

router.get("/",checkUser,(req, res) => {
  res.render("index", { title: "Home" });
});

const connectionURL='mongodb+srv://admin:admin123@cluster0.otcvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db=mongoose.connection;

db.on('err',console.log.bind(console,'error in mongo connection'))
db.once('open',()=>console.log('mongo connected'))

router.use(
  session({ secret: "secret", saveUninitialized: false, resave: false })
); //session declaration


router.get("*", checkUser);


router.get("/signUp", userController.signUpGet);
router.post("/signUp", userController.signUpPost);
router.get("/signIn", userController.signInGet);
router.get("/admin", adminController.adminSignInGet);
router.post('/adminSignIn',adminController.adminSignInPost)
router.get("/adminDashboard",requireAuth, adminController.adminDashboard);
router.post("/signIn", userController.signInPost);
router.get("/addWorkerGet", requireAuth, adminController.addWorkerGet);
router.post("/addWorkerPost", adminController.addWorkerPost);
router.get("/signOut", userController.signOutGet);

router.get("/adminSignOut", adminController.adminSignOutGet);
router.post("/workerDashboard", userController.workerDashboardPost);

module.exports=router;