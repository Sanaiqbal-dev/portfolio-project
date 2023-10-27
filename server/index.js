const dotEnv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotEnv.config();
const mongoString = process.env.DATABASE_URL;

console.log("DATABASE_URL is  : ", mongoString);
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.json());
app.listen(3000, () => {
  console.log("Server started at 3000");
});
