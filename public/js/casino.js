
// check if the page content is done loading
if(document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready);
  }else {
    ready();
  }
  
  function ready() {
    // remove btn fn
    const removeCartItemBtns = document.getElementsByClassName('btn-danger');
  
    for(let i = 0; i < removeCartItemBtns.length; i++) {
        const btn = removeCartItemBtns[i];
        btn.addEventListener('click', removeCartItem);
    }
  
    const quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for(let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
  
    const addToCartBtns = document.getElementsByClassName('shop-item-button');
    for(let i = 0; i < addToCartBtns.length; i++) {
        const btn = addToCartBtns[i];
        btn.addEventListener('click', addToCartClicked);
    }
  
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
  }
  
  function purchaseClicked() {
    const ctotal = document.getElementsByClassName('cart-total-price')[0].innerText
  
    if(ctotal){
      fetch('/store', {
      method: 'POST',
      body: JSON.stringify(ctotal)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
    }

    alert('Thank you for your purchase of ' + ctotal + " btc");
    const cartItems = document.getElementsByClassName('cart-items')[0];
  
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
  }
  
  function removeCartItem(event) {
    const btnClicked = event.target;
    btnClicked.parentElement.parentElement.remove();
  
    // after all items are removed total will be updated
    updateCartTotal();
  }
  
  function quantityChanged(event) {
    const input = event.target;
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
  }
  
  function addToCartClicked(event) {
    const btn = event.target;
    const shopItem = btn.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    const imgSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
  
    addItemToCart(title, price, imgSrc);
    updateCartTotal();
  }
  
  function addItemToCart(title, price, imgSrc) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');
  
    for(let i = 0; i < cartItemNames.length; i++) {
        if(cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }
    const cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imgSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
    `;
    cartRow.innerHTML = cartRowContents;
    // to append cardRow to the end of cardItems
    cartItems.append(cartRow);
    // add remove fn to the newly added remove btn
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
  }
  
  // create a fn to update the total
  function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;
  
    for(let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const priceEl = cartRow.getElementsByClassName('cart-price')[0];
        const quantityEl = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceEl.innerText.replace('$', ''));
        const quantity = quantityEl.value;
        total = total + (price * quantity);
    }
    // always have a rounded number with 2 decimal places
    total = Math.round(total * 100) / 100;
  console.log(total);
    document.getElementsByClassName('cart-total-price')[0].innerText = `$${total}`;
  }