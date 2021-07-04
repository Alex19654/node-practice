const path = require("path");
const fs = require("fs");
const { resolve } = require("path");

const pathToDir = path.join(
  path.dirname(require.main.filename),
  "data",
  "card.json"
);

class Card {
  static async add(product) {
    const card = await Card.fetch();
    const idx = card.products.findIndex((prd) => prd.id === product.id);
    const candidate = card.products[idx];
    if (candidate) {
      candidate.count++;
      card.products[idx] = candidate;
    } else {
      product.count = 1;
      card.products.push(product);
    }

    card.price += +product.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(pathToDir, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async remove(id) {
    const card = await Card.fetch();
    const idx = card.products.findIndex((prd) => prd.id === id);
    const product = card.products[idx];

    if (product.count === 1) {
      card.products = card.products.filter((prd) => prd.id !== id);
    } else {
      card.products[idx].count--;
    }

    card.price -= product.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(pathToDir, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToDir, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;
