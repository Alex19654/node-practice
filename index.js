const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exhbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");

const app = express(); // Create app object

/* Add routes */
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const productsRoutes = require("./routes/products");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");

/* Configure handlebars ob */
const hbs = exhbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine); // Registrate 'hbs' in app
app.set("view engine", "hbs"); // Set hbs
app.set("views", "views"); // Set folder with views
app.use(express.static(path.join(__dirname, "public"))); // Add public folder with scripts to express
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.port || 3000;

/* Middleware script */
app.use(async (req, res, next) => {
  try {
    const user = await User.findById("60fbf60a3d7fe52a9e9316c0");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

/* Registrate added routes with prefixes*/
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/products", productsRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);

async function start() {
  try {
    const db =
      "mongodb+srv://Oleksandr:ZNdWp8fHk9763yU@cluster0.720qa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: "podgorodeczkij19@gmail.com",
        name: "Alex",
        cart: { items: [] },
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log("Server is running!");
    });
  } catch (err) {
    console.log(err);
  }
}

start();
