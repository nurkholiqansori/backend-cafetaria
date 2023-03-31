const app = require("express")();
const Order = require("../schemas/orderSchema");

app.post("/order", async (req, res) => {
  const order = Order({
    user: req.body.user,
    items: req.body.items,
    price: req.body.price,
    table: req.body.table,
    status: req.body.status,
  });

  try {
    const savedOrder = await order.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = app;
