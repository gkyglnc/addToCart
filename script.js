const shopCart = document.querySelector(".shop-cart");

//! sepeti açıp kapatma
function ShopCart() {
  if (shopCart.style.display == "flex") {
    shopCart.style.display = "none";
  } else {
    shopCart.style.display = "flex";
  }
}

const card = document.getElementsByClassName("item-box");
const btnAdd = document.getElementsByClassName("buy-now-button");
const cartList = document.getElementById("shopping-cart");

class Shopping {
  constructor(title, price, image) {
    this.image = image;
    this.title = title;
    this.price = price;
  }
}

class UI {
  constructor() {
    this.cartItems = [];
  }

  addToCart(shopping) {
    let existingCartItem = null;

    for (const item of this.cartItems) {
      if (item.title === shopping.title) {
        existingCartItem = item;
        break;
      }
    }

    if (existingCartItem) {
      existingCartItem.quantity++;
      this.updateCartItemQuantity(existingCartItem);
    } else {
      shopping.quantity = 1;
      this.cartItems.push(shopping);

      const listItem = document.createElement("div");
      listItem.classList = "shopping-cart-item";

      listItem.innerHTML = `
          <div class="shopping-cart-item-img"><img src="${shopping.image}" alt=""></div>
          <div class="x"><p class="shopping-cart-item-title" style="font-weight: bold;">${shopping.title}</p></div>
          <div class="quantity"><button class="decrement"><h4>-</h4></button><p>${shopping.quantity}</p><button class="increment"><h4>+</h4></button></div>
          <div class="y"><p class="shopping-cart-item-price" style="font-weight: bold;">${shopping.price}</p></div>
          <div class="z"><i class="bi bi-trash"></i></div>
      `;
      cartList.appendChild(listItem);

      const incrementBtn = listItem.querySelector(".increment");
      incrementBtn.addEventListener("click", () => {
        shopping.quantity++;
        this.updateCartItemQuantity(shopping, listItem);
        this.updateTotal();
        this.saveCartToLocalStorage();
      });
  
      const decrementBtn = listItem.querySelector(".decrement");
      decrementBtn.addEventListener("click", () => {
        if (shopping.quantity > 1) {
          shopping.quantity--;
          this.updateCartItemQuantity(shopping, listItem);
          this.updateTotal();
          this.saveCartToLocalStorage();
        }
      });
  
    }
    
    this.updateTotal();
    this.saveCartToLocalStorage();
    this.removeCart();
  }

  removeCart() {
    let btnRemove = document.getElementsByClassName("bi-trash");
    for (let i = 0; i < btnRemove.length; i++) {
      btnRemove[i].addEventListener("click", (event) => {
        const title = event.target.closest(".shopping-cart-item").querySelector(".shopping-cart-item-title").textContent;
        const itemToRemove = this.cartItems.find(item => item.title === title);
        if (itemToRemove) {
          this.cartItems = this.cartItems.filter(item => item.title !== title);
          event.target.closest(".shopping-cart-item").remove();
          this.updateTotal();
          this.saveCartToLocalStorage();
        }
      });
    }
  }

  updateTotal() {
    const cartItems = document.getElementsByClassName("shopping-cart-item");
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      let price = parseFloat(cartItems[i].querySelector(".shopping-cart-item-price").textContent);
      let quantity = parseInt(cartItems[i].querySelector(".quantity p").textContent);
      total += price * quantity;
    }

    document.getElementById("pricee").textContent = total.toFixed(2) + "$";
  }

  
  saveCartToLocalStorage() {
    const cartItems = Array.from(document.getElementsByClassName("shopping-cart-item"));
    const serializedCart = cartItems.map(item => {
      return {
        image: item.querySelector("img").src,
        title: item.querySelector(".shopping-cart-item-title").textContent,
        price: item.querySelector(".shopping-cart-item-price").textContent,
        quantity: item.querySelector(".quantity p").textContent
      };
    });
    localStorage.setItem("cart", JSON.stringify(serializedCart));
  }

  loadCartFromLocalStorage() {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    for (const item of storedCart) {
      const shopping = new Shopping(item.title, item.price, item.image, item.quantity);
      shopping.quantity = item.quantity;
      this.addToCart(shopping);
    }
  }
  

  updateCartItemQuantity(item) {
    const cartItems = document.getElementsByClassName("shopping-cart-item");
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].querySelector(".shopping-cart-item-title").textContent === item.title) {
        cartItems[i].querySelector(".quantity p").textContent = item.quantity;
        break;
      }
    }
  }
}

document.getElementById("empty-cart").addEventListener("click", () => {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }

  localStorage.removeItem("cart");

  ui.updateTotal();
});

const ui = new UI();
ui.loadCartFromLocalStorage();

for (let i = 0; i < card.length; i++) {
  btnAdd[i].addEventListener("click", (e) => {
    let title = card[i].getElementsByClassName("product-name")[0].textContent;
    let price = card[i].getElementsByClassName("product-price")[0].textContent;
    let image = card[i].getElementsByClassName("product-image")[0].src;

    let shopping = new Shopping(title, price, image);

    ui.addToCart(shopping);

    e.preventDefault();
  });
}
