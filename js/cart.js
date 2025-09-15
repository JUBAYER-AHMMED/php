document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const orderForm = document.getElementById("orderForm");
  const orderNotice = document.getElementById("orderNotice");

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  const renderCart = () => {
    const cart = getCart();
    cartItemsEl.innerHTML = cart.length
      ? cart
          .map(
            (item, i) => `
          <li class="cart__item">
            ${item.name} x${item.quantity} - TK${item.price * item.quantity}
            <button class="cart__btn" data-action="decrease" data-index="${i}">-</button>
            <button class="cart__btn" data-action="increase" data-index="${i}">+</button>
            <button class="cart__btn" data-action="remove" data-index="${i}">x</button>
          </li>
        `
          )
          .join("")
      : "<li>Your cart is empty.</li>";

    cartTotalEl.textContent = `Total: TK${cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )}`;
  };

  const addToCart = (item) => {
    const cart = getCart();
    const existing = cart.find((i) => i.id === item.id);
    existing ? existing.quantity++ : cart.push({ ...item, quantity: 1 });
    saveCart(cart);
    renderCart();
  };

  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const cart = getCart();
    const i = parseInt(btn.dataset.index);
    const action = btn.dataset.action;

    if (action === "increase") cart[i].quantity++;
    else if (action === "decrease")
      cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
    else if (action === "remove") cart.splice(i, 1);

    saveCart(cart);
    renderCart();
  });

  document.querySelectorAll(".popular__button").forEach((btn) =>
    btn.addEventListener("click", () =>
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
      })
    )
  );

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) return alert("Your cart is empty!");

    const formData = {
      customerName: document.getElementById("customerName").value.trim(),
      customerEmail: document.getElementById("customerEmail").value.trim(),
      customerAddress: document.getElementById("customerAddress").value.trim(),
      paymentMethod: document.getElementById("paymentMethod").value,
      cartItems: cart,
    };

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerAddress
    ) {
      orderNotice.textContent = "Please fill in all required fields.";
      return;
    }

    try {
      const res = await fetch("backend/place_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert(`Order placed successfully! Total: TK${data.total}`);
        localStorage.removeItem("cart");
        renderCart();
        orderForm.reset();
        orderNotice.textContent = "";
      } else orderNotice.textContent = data.message || "Error placing order.";
    } catch {
      orderNotice.textContent = "Error placing order. Please try again.";
    }
  });

  renderCart();
});
