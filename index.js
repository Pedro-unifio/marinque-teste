const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const produtos = [
  { id: 1, nome: "notebook", preco: 6700 },
  { id: 2, nome: "mouse", preco: 120 }
];

app.get("/", (req, res) => {
  res.status(200).send("Olá, mundo!");
});

app.get("/produtos", (req, res) => {
  res.status(200).json(produtos);
});

app.get("/produtos/:id", (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  return res.status(200).json(produto);
});

app.post("/produtos", (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || typeof preco !== "number" || Number.isNaN(preco)) {
    return res.status(400).json({
      erro: "Informe nome e preco (número)"
    });
  }

  const novoProduto = {
    id: produtos.length ? Math.max(...produtos.map((item) => item.id)) + 1 : 1,
    nome,
    preco
  };

  produtos.push(novoProduto);
  return res.status(201).json(novoProduto);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;