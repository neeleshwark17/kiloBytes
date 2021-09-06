const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, "Enter Name"],
  },
  phone: {
    type: String,
    required: [true, "Enter Phone!"],
    unique: [true, "already exists"],
  },
  userType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    // required: [true, "Enter Password!"],
    minlength: [6, "Min length 6 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const saltRounds = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, saltRounds);
});

//static method for signIn

userSchema.statics.login = function (phone, password) {
  return new Promise((resolve, reject) => {
    this.findOne({ phone }, (err, results) => {
      if (err) {
        console.log("RES--ERRORS", err);
        reject(err);
      } else {
        console.log("RES--", results);
        if(!results) {
          resolve(results);
          return null;}
        if (results) {
          const auth = bcrypt.compare(password, results.password);
          if (auth) {
            resolve(results);
            return results;
          } else {
            throw Error("Invalid password");
          }
        }
      }
    });
  });
};

const User = mongoose.model("user", userSchema);
module.exports = User;
