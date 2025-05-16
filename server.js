const app = require('./app')
const { getProducts, getAttributeMeta } = require('./repository/productRepository');

const PORT = 3000;

async function startServerAndLoadExternalData() {
  try {

    const products = await getProducts();
    const attributeMeta = await getAttributeMeta();

    app.locals.products = products;
    app.locals.attributeMeta = attributeMeta;

    app.listen(PORT, () => {
      console.log(`running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server and load external data:', err);
    process.exit(1);
  }
}

startServerAndLoadExternalData();

