const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./Config/db");

const app = express();

dotenv.config();

connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//api
app.use("/api/v1/users", require("./Routes/UserRoute"));
app.use("/api/v1/notification", require("./Routes/NotificationRoute"));
app.use("/api/v1/contact", require("./Routes/UserContactRoute"));
app.use("/api/v1/package", require("./Routes/PackageRoute"));

app.use("/api/v1/purchase", require("./Routes/PurchaseRoute"));
app.use("/api/v1/image", require("./Routes/SliderimgRoute"));

app.use("/api/v1/coin", require("./Routes/CoinRoute"));
app.use("/api/v1/account", require("./Routes/AccountRoute"));
app.use("/api/v1/exchange", require("./Routes/ExchangeRoute"));

app.get("/", (req, res) => {
  res.send("Welcome to web");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
