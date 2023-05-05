const express = require("express");
const cors = require("cors");
const multer = require("multer");
const productRoutes = require("./router/productRoutes");
const imageRoutes = require("./router/imageRoutes");

const app = express();
const PORT = 3000;

app.use(cors());

// // To parse URL-encoded bodies
// app.use(express.urlencoded({ extended: false }));

// // To parse JSON bodies
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

const upload = multer({ dest: "uploads/" });

app.use("/products", productRoutes);

app.use("/image", imageRoutes);

app.get("/", (req, res) => {
  console.log("hits");
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
