// There are client's script for modifiynig price view

const toCurrency = (price) => {
  return new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(price);
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const cardElement = document.querySelector("#card");
if (cardElement) {
  card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      fetch("/card/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.products.length) {
            const html = card.products
              .map((prd) => {
                return `
                <tr>
                  <td>{{prd.title}}</td>
                  <td>{{prd.count}}</td>
                  <td>
                    <button
                      class="btn btn-small js-remove"
                      data-id="{{prd.id}}"
                    >Delete</button>
                  </td>
                </tr>
              `;
              })
              .join("");
            cardElement.querySelector("tbody").innerHTML = html;
            cardElement.querySelector(".price").innerHTML = toCurrency(
              card.price
            );
          } else {
            cardElement.innerHTML = "<p>Basket is empty</p>";
          }
        });
    }
  });
}
