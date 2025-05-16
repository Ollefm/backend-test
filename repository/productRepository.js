const PRODUCTS_URL = "https://draft.grebban.com/backend/products.json"
const ATTRIBUTE_META_URL = "https://draft.grebban.com/backend/attribute_meta.json"

async function getProducts() {
  try {
    const res = await fetch(PRODUCTS_URL);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
}

async function getAttributeMeta() {
  try {
    const res = await fetch(ATTRIBUTE_META_URL);
    if (!res.ok) throw new Error(`Failed to fetch attribute meta: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching attribute meta:", error.message);
    throw error;
  }
}

module.exports = { getProducts, getAttributeMeta };