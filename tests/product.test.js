const request = require("supertest");
const app = require("../app");

describe("GET /product", () => {
  it("returns status 200 (ok) and a valid product list", async () => {
    const res = await request(app).get("/product?page=1&page_size=2");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("products");
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
  });

  it("defaults to positive integer page number if negative integer page is passed", async () => {
    const res = await request(app).get("/product?page=-2&page_size=5");
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(2);
  });

  it("correctly set how many products per page", async () => {
    const res = await request(app).get("/product?page=1&page_size=4");

    const products = res.body.products;

    expect(products.length).toBeLessThanOrEqual(4);
  });

  it("returns empty array if page is out of range", async () => {
    const res = await request(app).get("/product?page=999&page_size=100");
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(0);
  });

  it("responds with JSON", async () => {
    const res = await request(app).get("/product?page=1&page_size=10");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(typeof res.body).toBe("object");
    expect(res.body).not.toBeNull();
  });

  it("checks whether the attributes array has the correct props", async () => {
    const res = await request(app).get("/product?page=1&page_size=10");
    const attr = res.body.products.every((product) => {
      if (product.attributes.length > 0) {
        return product.attributes.every(
          (attr) => "name" in attr && "value" in attr
        );
      }
      return true;
    });
    expect(attr).toBe(true);
  });

  // simple test, 
  it('all hierarchical categories contain " > "', async () => {
    const res = await request(app).get("/product?page=1&page_size=10");
    expect(res.statusCode).toBe(200);

    res.body.products.forEach((product) => {
      product.attributes
        .filter((attr) => attr.name === "Category")
        .forEach((attr) => {
          if (attr.value.includes(" > ")) {
            expect(attr.value).toMatch(/ > /);
          }
        });
    });
  });

  // Just making sure that it does one correct according to the hierachical order.
  it('includes "Cars > Hybrids" as a category value', async () => {
    const res = await request(app).get("/product?page=1&page_size=10");
    expect(res.statusCode).toBe(200);

    const hasTargetCategory = res.body.products.some((product) =>
      product.attributes.some(
        (attr) => attr.name === "Category" && attr.value === "Cars > Hybrids"
      )
    );

    expect(hasTargetCategory).toBe(true);
  });
});
