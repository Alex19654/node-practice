// There are client's script for modifiynig price view

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = new Intl.NumberFormat("ua-UA", {
    currency: "uah",
    style: "currency",
  }).format(node.textContent);
});
