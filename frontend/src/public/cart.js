const cartContainer = document.getElementById("cart-container");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const productsContainer = document.getElementById("products-container");
const mixMatch= document.getElementById("mix-and-match");
const wardrobeitem= document.getElementById("wardrobe-items");
let isWardrobeShowing = false;
let isTop= false;
let isBottom = false;
let isDress = false;

class ShoppingCart {
    constructor() {
      this.items = [];
      this.total = 0;
      this.taxRate = 8.25;
      this.loadCart();
    }

    addItem(product) {
        this.items.push(product);
        this.saveCart();
    }

    subsItem(product) {
        const itemIndex = this.items.findIndex(item => item.id === product.id);
        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
            this.saveCart();
        }
    }

    getCounts() {
        return this.items.length;
    }

    calculateTaxes(amount) {
        return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
    }
    
    calculateTotal() {
        const subTotal = this.items.reduce((total, item) => total + item.price, 0);
        const tax = this.calculateTaxes(subTotal);
        this.total = subTotal + tax;
        const cartSubTotal = document.getElementById("subtotal");
        const cartTaxes = document.getElementById("taxes");
        const cartTotal = document.getElementById("total");
        if(cartSubTotal&&cartTaxes&&cartTotal){
        cartSubTotal.textContent = `${subTotal.toFixed(2)}`;
        cartTaxes.textContent = `${tax.toFixed(2)}`;
        cartTotal.textContent = `${this.total.toFixed(2)}`;
        }
        return this.total;
    }
    
    saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(this.items));
    }

    loadCart() {
        const savedItems = JSON.parse(localStorage.getItem("cartItems"));
        if (savedItems) {
            this.items = savedItems;
        }
    }
    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart(); 
    }
};

class Wardrobe {
    constructor(){
        this.items = [];
        this.isTop = false;
        this.isBottom = false;
        this.isDress = false; 
    }

    canMix(){
        if((this.isTop&&this.isDress)||(this.isDress&&this.isBottom)){
            return false;
        } else{
            return true;
        }
    }

    addItem(clothe){
        wardrobeitem.innerHTML += `
        <div id="product${clothe.id}" class="products">
           <div class="dragable" style="top:0; left:0; position:absolute;"><img src="${clothe.img}" class="resize" style="width:144px; height: 144px"></div>
           `;
    }

    clearWardrobe(){
        this.items = [];
        this.isTop = false;
        this.isBottom = false;
        this.isDress = false;
        wardrobeitem.innerHTML = ``;
    }

}
const cart = new ShoppingCart();
const tryClothes = new Wardrobe();
const addToCartBtns = document.getElementsByClassName("addbtn");
const clear = document.querySelector(".clear");
const Wardrobebtn = document.querySelector(".wardrobe");
const tryBtn= document.querySelector(".trybtn");
const wardrobeclear= document.querySelector(".wardrobeclear");
const checkout= document.querySelector(".checkout");


document.addEventListener('DOMContentLoaded', () => {
    cart.loadCart();
    updateCartDisplay(cart);
  });
  
  function updateCartDisplay(cart) {

    const productsContainer = document.getElementById('products-container');
    const cartSummary = document.getElementById('cart-summary');
    productsContainer.innerHTML = '';
    
    if (cart.items.length === 0) {
      productsContainer.innerHTML = `
        <section class="content" id="emptymessage">
          <h1 class="empty">Your Cart is still empty</h1>
          <div class="button"> 
            <a href="Products.html" class="label">Discover Now</a>
          </div>
        </section>`;
        cartSummary.innerHTML = ''
    } else {
      cartSummary.innerHTML = `
      <div class="cart-count">
        Items: <span id="total-items">${cart.getCounts()}</span>
      </div>
      <div class="price-breakdown">
        <div>Subtotal: $<span id="subtotal">0.00</span></div>
        <div>Taxes: $<span id="taxes">0.00</span></div>
        <div>Total: $<span id="total">0.00</span></div>
      </div>
      <div> 
        <button class="checkout">Checkout</button>
      </div>`;
      const itemCounts = {};
      document.getElementById('total-items').textContent = cart.getCounts();

      cart.items.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
      });
  
      Object.keys(itemCounts).forEach(id => {
        const item = cart.items.find(i => i.id === Number(id));
        productsContainer.innerHTML += `
            <div id="product${item.id}" class="products">
                <div class="group">
                <div class="img"><img src="${item.img}" class="image"></div>
                    <div class="desc">
                        <div class="nameandtry"> 
                            <h3 class="productdes">${item.name}</h3>  
                        </div>
                        <h3 class="productdes">$${item.price.toFixed(2)}</h3>
                         <section class="count"> 
                           <button class="plus"  data-id="${item.id}" 
                                    data-name="${item.name}" 
                                    data-price="${item.price}" 
                                    data-img="${item.img}"
                                    data-type="${item.type}">+</button>
                            ${itemCounts[id]}  
                            <button class="subs" data-id="${item.id}" 
                                    data-name="${item.name}" 
                                    data-price="${item.price}" 
                                    data-img="${item.img}"
                                    data-type="${item.type}">-</button>
                        </section>  
                    </div>
                    <div class="AddButton"> 
                            <button class="trybtn"
                                data-img="${item.img}"
                                data-type="${item.type}">Try</button>
                            </div>
                </div>
            </div>`;
      });
      cart.calculateTotal();
    }
  }

[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => {
        const button = event.target;
        const product = {
            img: button.getAttribute("data-img"),
            id: Number(button.dataset.id),
            name: button.dataset.name,
            price: Number(button.dataset.price),
            type: button.dataset.type
          };        
          console.log("Image path:", product.img);
        cart.addItem(product);
        totalNumberOfItems.textContent = cart.getCounts();
        cart.calculateTotal();
    })
  }
);

clear.addEventListener("click", (event) => {
    cart.clearCart();
    updateCartDisplay(cart);
});

Wardrobebtn.addEventListener("click",(event)=> {
    isWardrobeShowing = !isWardrobeShowing;
    mixMatch.style.display = isWardrobeShowing ? "block" : "none";
});

wardrobeclear.addEventListener("click",(event)=> {
    tryClothes.clearWardrobe();
    console.log("try to clear");
})

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("trybtn")) {
    const button = event.target;
    const clothe = {
        img: button.getAttribute("data-img"),
        type: button.dataset.type
      };  
    if(button.dataset.type === "dress"){
        if(tryClothes.isDress=== true){
            window.alert("Only can add 1 item for this type");
        }else{
            tryClothes.isDress = true;
            if(tryClothes.canMix()){
                tryClothes.addItem(clothe);
            } else{
                tryClothes.isDress = false;
                window.alert("Can't mix this type");
            }
        }
    }
    if(button.dataset.type === "bottom"){
        if(tryClothes.isBottom=== true){
            window.alert("Only can add 1 item for this type");
        }else{
            tryClothes.isBottom = true;
            if(tryClothes.canMix()){
            tryClothes.addItem(clothe);
            } else{
                tryClothes.isBottom = false;
                window.alert("Can't mix this type");
            }
        }
    }
    if(button.dataset.type === "top"){
        if(tryClothes.isTop=== true){
            window.alert("Only can add 1 item for this type");
        }else{
            tryClothes.isTop = true;
            if(tryClothes.canMix()){
                tryClothes.addItem(clothe);
            } else{
                tryClothes.isTop = false;
                window.alert("Can't mix this type");
            }
        }
    }
    if(button.dataset.type === "acc"){
        tryClothes.addItem(clothe);
    }
}});

document.addEventListener("click",(event)=>{
    if(event.target.classList.contains("resize")){
        if(event.shiftKey){
            upsize(event.target, event);
        }
        if(event.altKey){
            downsize(event.target, event)
        }
    }
})


function upsize(item, event){
    item.style.width=(parseInt(getComputedStyle(item).width)+ 5)+"px";
    item.style.height=(parseInt(getComputedStyle(item).height)+5)+"px";
}

function downsize(item, event){
    item.style.width=(parseInt(getComputedStyle(item).width)- 5)+"px";
    item.style.height=(parseInt(getComputedStyle(item).height)-5)+"px";
}

let startX;
let startY;
let drag=null;

document.addEventListener("mousedown",(event)=>{
    if(event.target.closest(".dragable")){
        drag= event.target;
        startX= event.clientX;
        startY= event.clientY;
        drag.style.position = "absolute";
        
    }
});

document.addEventListener('mousemove', (event) => {
    if(drag) {
      const dx = event.clientX-startX;
      const dy = event.clientY-startY;
  
      drag.style.left = dx + 'px';
      drag.style.top = dy + 'px';
    }
  });

document.addEventListener("mouseup",(event)=>{
    drag=null;
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("plus")) {
        const button = event.target;
        const product = {
            img: button.getAttribute("data-img"),
            id: Number(button.dataset.id),
            name: button.dataset.name,
            price: Number(button.dataset.price),
            type: button.dataset.type
          };        
          console.log("Image path:", product.img);
        cart.addItem(product);
        updateCartDisplay(cart);
        totalNumberOfItems.textContent = cart.getCounts();
        cart.calculateTotal();
    }
})

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("subs")) {
        const button = event.target;
        const product = {
            img: button.getAttribute("data-img"),
            id: Number(button.dataset.id),
            name: button.dataset.name,
            price: Number(button.dataset.price),
            type: button.dataset.type
          };        
          console.log("Image path:", product.img);
        cart.subsItem(product);
        updateCartDisplay(cart);
        totalNumberOfItems.textContent = cart.getCounts();
        cart.calculateTotal();
    }
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("checkout")) {
        let savedItems = JSON.parse(localStorage.getItem("orderHistory"));
        if(!savedItems){
            savedItems=[];
        }
    const newOrder= {
        date: new Date().toUTCString(),
        orderid: savedItems.length,
        item: cart.items,
        total: cart.total 
      };        
    savedItems.push(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(savedItems));
    window.alert("you have check out");
    }
});
