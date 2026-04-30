const express = require("express");
require("./database"); 

const userRoutes = require("./routes/user.routes.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando");
});

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});