document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const orderForm = document.getElementById("orderForm");
  const orderNotice = document.getElementById("orderNotice");
  
  // 1️⃣ Get cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // 2️⃣ Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // 3️⃣ Render cart items
  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<li>Your cart is empty.</li>";
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("cart__item");
        li.innerHTML = `
          ${item.name} x${item.quantity} - TK${item.price * item.quantity}
          <button class="cart__btn" data-action="decrease" data-index="${index}">-</button>
          <button class="cart__btn" data-action="increase" data-index="${index}">+</button>
          <button class="cart__btn" data-action="remove" data-index="${index}">x</button>
        `;
        cartItemsEl.appendChild(li);
        total += item.price * item.quantity;
      });
    }

    cartTotalEl.textContent = `Total: TK${total}`;
  }

  // 4️⃣ Add item to cart
  function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
    renderCart();
  }

  // 5️⃣ Handle clicks inside cart (increase/decrease/remove)
  cartItemsEl.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const cart = getCart();
    const index = parseInt(button.dataset.index);
    const action = button.dataset.action;

    if (action === "increase") {
      cart[index].quantity += 1;
    } else if (action === "decrease") {
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    } else if (action === "remove") {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });

  // 6️⃣ Attach event listener to all popular buttons
  const popularButtons = document.querySelectorAll(".popular__button");
  popularButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
      };
      addToCart(item);
    });
  });

  // 7️⃣ Handle order form submission
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

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
      } else {
        orderNotice.textContent = data.message || "Error placing order.";
      }
    } catch (err) {
      console.error(err);
      orderNotice.textContent = "Error placing order. Please try again.";
    }
  });

  // 8️⃣ Initial render
  renderCart();
});
