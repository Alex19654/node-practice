const uuid = require("uuid/v4"); // connect identifier generator librabry
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");

class Product {
  constructor(title, price, image) {
    this.title = title;
    this.price = price;
    this.image = image;
    this.id = uuid();
  }

  /* Prepare data to JSON conversion - create object */
  toJSON() {
    return {
      title: this.title,
      price: this.price,
      image: this.image,
      id: this.id,
    };
  }

  /* Save data in JSON to the array in "products.json" */
  async save() {
    const products = await Product.getAll();
    products.push(this.toJSON());

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "products.json"),
        JSON.stringify(products),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  /* Static method, to get array from "products.json" */
  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "products.json"),
        "utf-8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      );
    });
  }
}

module.exports = Product;
