// There are client's script for modifiynig price view

const toCurrency = (price) => {
  return new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat(
    "ru-RU",
    {
      day: "2-digit",
      month: "Long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }.format(new Date(date))
  );
};

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const cardElement = document.querySelector("#card");
if (cardElement) {
  card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf
        }
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.products.length) {
            const html = card.products
              .map((prd) => {
                return `
                  <tr>
                    <td>${prd.title}</td>
                    <td>${prd.count}</td>
                    <td>
                      <button
                        class="btn btn-small js-remove"
                        data-id="${prd.id}"
                        data-csrf="${csrf}"
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

/* Initialization of tabs for register/login */
M.Tabs.init(document.querySelectorAll(".tabs"));
