const { getPageProducts } = require('../services/productService');

exports.getProducts = async function (req, res) {
  try {
    const page = Math.abs(parseInt(req.query.page, 10)) || 1;
    const pageSize = Math.abs(parseInt(req.query.page_size, 10)) || 10;

    const result = await getPageProducts(page, pageSize);
    res.json(result);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};