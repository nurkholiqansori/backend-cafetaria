const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const middleware = require("./middleware/verify");
const db = require("./schemas");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const itemRoutes = require("./routes/item");
require("dotenv/config");

const port = process.env.PORT || 8000;
const urldb = process.env.MONGODB_URI || "mongodb://localhost:27017/cafetaria";
const allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("http-responses"));
app.use(cors({ origin: allowedOrigins }));

router.use(authRoutes);
app.use(middleware);

console.log("Connecting to database...");

db.mongoose
  .connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database!");
    /***** ROUTES *****/

    router.use(orderRoutes);
    router.use(itemRoutes);

    /***** END *****/
    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed & Server not started!");
  });

app.use("/.netlify/functions/index", app);
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
