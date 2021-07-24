const { Schema, model } = require("mongoose");

/* Create new instance of "Schema" class */
const product = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

module.exports = model("Product", product);
