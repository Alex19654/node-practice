const { Router } = require("express");
const router = Router();
const Order = require("../models/order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("user.userId");

    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((order) => {
        return {
          ...order._doc,
          price: order.products.reduce((total, prd) => {
            return (total += prd.count * prd.product.price);
          }, 0),
        };
      }),
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate();

    const products = user.cart.items.map((item) => ({
      count: item.count,
      product: { ...item.productId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
