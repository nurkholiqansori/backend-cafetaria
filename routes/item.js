const app = require("express")();
const Item = require("../schemas/itemSchema");

app.post("/item", async (req, res) => {
  const item = Item({
    name: req.body.name,
    thumbnail: req.body.thumbnail,
    ordered: req.body.ordered,
    category: req.body.category,
    price: req.body.price,
    status: req.body.status,
  });

  try {
    const savedOrder = await item.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = app;
