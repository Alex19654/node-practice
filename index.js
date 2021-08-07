const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const session = require("express-session");
const exhbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");
const varMiddleware = require("./middleware/variables");
const app = express(); // Create app object

/* Add routes */
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const productsRoutes = require("./routes/products");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

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

/* Set session */
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}));

app.use(varMiddleware); // Use middleware for session functionality

const PORT = process.env.port || 3000;

/* Registrate added routes with prefixes*/
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/products", productsRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

async function start() {
  try {
    const db =
      "mongodb+srv://Oleksandr:ZNdWp8fHk9763yU@cluster0.720qa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // const candidate = await User.findOne();

    // if (!candidate) {
    //   const user = new User({
    //     email: "podgorodeczkij19@gmail.com",
    //     name: "Alex",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log("Server is running!");
    });
  } catch (err) {
    console.log(err);
  }
}

start();
