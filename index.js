const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const prod = [
  { id: 1, nome: "notebook", preco: 6700 },
  { id: 2, nome: "mouse", preco: 120 }
];

app.get("/produtos", (req, res) => {
  res.status(200).json(prod);
});