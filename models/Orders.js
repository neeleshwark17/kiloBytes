const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productName: {
    type: String,
    unique: true,
    required: [true, "Enter Name"],
  },
  productType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  orderTime: {
    type: String,
    // required: [true, "Enter Password!"],
    minlength: [6, "Min length 6 characters"],
  },
  location: {
    type: String,
    maxlength: 50,
    required: true,
    trim: true,
    lowercase: true,
  },
  deliveryPerson: {
    type: String,
    required: [true, "Enter Phone!"],
    lowercase:true,
  },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
