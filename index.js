const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const csrf = require("csurf");
const Handlebars = require("handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const exhbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const keys = require("./keys/index");

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

/* Session connector to DB */
const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URL,
});

/* Set session */
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware); // Use middleware for session functionality
app.use(userMiddleware); //

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
    await mongoose.connect(keys.MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log("Server is running!");
    });
  } catch (err) {
    console.log(err);
  }
}

start();
