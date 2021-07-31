const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCard = function (product) {
  const clonedItems = [...this.cart.items]; // copy array
  const index = clonedItems.findIndex((prd) => {
    return prd.productId.toString() === product._id.toString();
  });

  if (index >= 0) {
    clonedItems[index].count += 1;
  } else {
    clonedItems.push({
      productId: product._id,
      count: 1,
    });
  }

  this.cart = { items: clonedItems };

  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const index = items.findIndex((prd) => {
    return prd.productId.toString() === id.toString();
  });

  if (items[index] === 1) {
    items = items.filter((prd) => prd.productId.toString() !== id.toString());
  } else {
    items[index].count--;
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
