const { getProducts, getAttributeMeta } = require("../repository/productRepository");

exports.getPageProducts = async function (page, pageSize) {
  try {
     
    //live-fetching product.json and attrubute_meta.json
     const products = await getProducts();
     const attributeMeta = await getAttributeMeta();
    

    // sort on name (sortering borde ske i queryn till databasen ej såhär)
    products.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    // Calculate pagination
    const totalPages = Math.ceil(products.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const newProd = [];
    // going through the correct products
    for (let i = startIndex; i < endIndex; i++) {
      const product = products[i];
      // Skip if product or attributes are missing
      if (!product || typeof product !== "object" || !product.attributes) {
        continue;
      }
      newProd.push(mapAttributes(product, attributeMeta));
    }

    return {
      products: newProd,
      page,
      totalPages,
    };
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

function mapAttributes(product, attributeMeta) {
  const newAttributes = [];

  for (const productAttr in product.attributes) {
    const val = product.attributes[productAttr] || "";
    const meta = attributeMeta.find((attr) => attr.code === productAttr);
    const items = val.split(",");

    if (meta) {
      for (const code of items) {
        if (meta.code === "cat") {
          let itemCategory = code.split("_");

          let itemCats = [];
          for (let j = 1; j < itemCategory.length; j++) {
            itemCats.push(itemCategory.slice(0, j + 1).join("_"));
          }
          let mappedCat = itemCats
            .map((x) => meta.values.find((val) => val.code === x).name)
            .join(" > ");

          newAttributes.push({ name: meta.name, value: mappedCat });
        } else {
          // Handle color attribute
          const found = meta.values.find((v) => v.code === code);
          const value = found?.name;
          newAttributes.push({ name: meta.name, value });
        }
      }
    }
  }
  
  return {
    id: product.id,
    name: product.name,
    attributes: newAttributes,
  };
}
