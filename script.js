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
  addToCart(shopping) {
    const listItem = document.createElement("div");
    listItem.classList = "shopping-cart-item";

    listItem.innerHTML = `
        <div class="shopping-cart-item-img"><img src="${shopping.image}" alt=""></div>
        <div class="x"><p class="shopping-cart-item-title" style="font-weight: bold;">${shopping.title}</p></div>
        <div class="y"><p class="shopping-cart-item-price" style="font-weight: bold;">${shopping.price}</p></div>
        <div class="z"><i class="bi bi-trash"></i></div>
    `;
    cartList.appendChild(listItem);

    this.updateTotal();
    this.saveCartToLocalStorage(); 
    this.removeCart(); 
  }

  removeCart() {
    let btnRemove = document.getElementsByClassName("bi-trash");
    for (let i = 0; i < btnRemove.length; i++) {
      btnRemove[i].addEventListener("click", function () {
        this.parentElement.parentElement.remove();
        ui.updateTotal(); 
        ui.saveCartToLocalStorage(); 
      });
    }
  }

  updateTotal() {
    const itemPrices = document.getElementsByClassName("shopping-cart-item-price");
    let total = 0;
    for (let i = 0; i < itemPrices.length; i++) {
      total += parseFloat(itemPrices[i].textContent);
    }

    document.getElementById("pricee").textContent = total.toFixed(2) + "$";
  }

  //! Sepeti yerel depolamaya kaydet
  saveCartToLocalStorage() {
    const cartItems = Array.from(document.getElementsByClassName("shopping-cart-item"));
    const serializedCart = cartItems.map(item => {
      return {
        image: item.querySelector("img").src,
        title: item.querySelector(".shopping-cart-item-title").textContent,
        price: item.querySelector(".shopping-cart-item-price").textContent
      };
    });
    localStorage.setItem("cart", JSON.stringify(serializedCart));
  }

  //! Yerel depolamadaki sepeti yükle
  loadCartFromLocalStorage() {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    for (const item of storedCart) {
      const shopping = new Shopping(item.title, item.price, item.image);
      this.addToCart(shopping);
    }
  }
}


document.getElementById("empty-cart").addEventListener("click", function() {

  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }

  localStorage.removeItem("cart");

  ui.updateTotal();
});


const ui = new UI(); 
ui.loadCartFromLocalStorage();

for (let i = 0; i < card.length; i++) {
  btnAdd[i].addEventListener("click", function (e) {
    let title = card[i].getElementsByClassName("product-name")[0].textContent;
    let price = card[i].getElementsByClassName("product-price")[0].textContent;
    let image = card[i].getElementsByClassName("product-image")[0].src;

    let shopping = new Shopping(title, price, image);

    ui.addToCart(shopping);
    
    e.preventDefault();
  });
}
