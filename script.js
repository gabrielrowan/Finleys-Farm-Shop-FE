

// Checks if DOM is ready before executing javascript referencing DOM elements
document.addEventListener("DOMContentLoaded", function ()
{
    hideModalByDefault();
    addAddButtonFunctionality();
    addModalEventListeners();
    initialiseCart();

});



// Adds on click functionality to add Buttons
const addAddButtonFunctionality = () =>
{
    const addButtons = document.getElementsByClassName("add-to-cart");
    for (let i = 0; i < addButtons.length; i++)
    {
        const button = addButtons[i];
        button.addEventListener("click", addButtonClicked);
    }
}

// Increase quantity of cart item
const changeQuantity = (changeType, event, productId, cartModal = false) =>
{
    const quantityInput = event.target.parentElement.querySelector(".input-cart-quantity");
    const currentQuantity = parseInt(quantityInput.value);
    const maxQuantity = 15;
    let updatedQuantity = 0;

    switch (changeType)
    {
        case ("add"):
            updatedQuantity = Math.min(currentQuantity + 1, maxQuantity);
            break;
        case ("subtract"):
            updatedQuantity = currentQuantity - 1;
            break;
    }

    syncQuantityInputValue(updatedQuantity, quantityInput, productId);

    if (updatedQuantity === 0 && cartModal === false)
    {

        ReturnToCartAddButton(event);
        changeCartItemTotal("subtract");
        removeCartItemFromLocalStorage(productId);
    }

    //change the quantity in local storage for the product being updated
    updateQuantityLocalStorage(productId, updatedQuantity);

}

const syncQuantityInputValue = (updatedQuantity, quantityInput, productId) =>
{
    //Updates quantity input from product list
    quantityInput.value = updatedQuantity;
    //Updates quantity input from cart item in modal
    const cartItemList = document.querySelector(".cart-item-list");
    const matchingModalCartItem = cartItemList.querySelector(`[data-id="${productId}"]`);
    const modalCartItemInputElement = matchingModalCartItem.querySelector(".input-cart-quantity");
    modalCartItemInputElement.value = updatedQuantity;
}

const ReturnToCartAddButton = (event) =>
{
    event.target.parentElement.remove();
    const addButton = event.target.parentElement.querySelector(".add-to-cart");
    addButton.style.display = "block";
}

// Adds functionality to increase quantity button
const addQuantityButtonsFunctionality = (buttonParent, productId, cartModal = false) =>
{
    const increaseQuantityButton = buttonParent.querySelector(".increase-quantity");
    increaseQuantityButton.addEventListener("click", (event) => changeQuantity("add", event, productId, cartModal));
    const decreaseQuantityButton = buttonParent.querySelector(".decrease-quantity");
    decreaseQuantityButton.addEventListener("click", (event) => changeQuantity("subtract", event, productId, cartModal));

}


// Removes add button from product card and replaces it with quantity input controls
// Increases cart count by 1
// Adds functionality to quantity buttons so that they can increase and decrease by 1
// Adds cart item to local storage
// Update total price
const addButtonClicked = event =>
{
    const shopItemContent = event.target.parentElement;
    const addButton = shopItemContent.querySelector(".add-to-cart");
    const productId = shopItemContent.parentElement.dataset.id;
    addButton.style.display = "none";
    addCartItemInput(shopItemContent);
    changeCartItemTotal("add");
    addCartItemToLocalStorageCart(shopItemContent, productId);
    addQuantityButtonsFunctionality(shopItemContent, productId);
    //update price total 
    const totalPrice = getCartTotal();
    displayCartTotal(totalPrice);

}

//changeType can be "add" or "subtract". Depending on changeType, cartItemTotal is increased or decreased by 1
//changes cart modal item count and cart count badge
const changeCartItemTotal = changeType =>
{
    const cartCountElement = document.querySelector(".cart-count");
    const currentCartCount = parseInt(cartCountElement.innerText);
    const modalCartCountElement = document.querySelector(".cart-header-title");

    let updatedCartCount = 0;

    switch (changeType)
    {
        case ("add"):
            updatedCartCount = currentCartCount + 1;
            cartCountElement.innerText = updatedCartCount;
            break;
        case ("subtract"):
            updatedCartCount = currentCartCount - 1;
            cartCountElement.innerText = updatedCartCount;
    }

    if (updatedCartCount === 1)
    {
        modalCartCountElement.innerText = `Trolley (${updatedCartCount} item)`;

    }
    else if (updatedCartCount > 1)
    {
        modalCartCountElement.innerText = `Trolley (${updatedCartCount} items)`;

    }
    else
    {
        modalCartCountElement.innerText = `Trolley (0 items)`;
    }


}


// Creates elements for quantity input controls and appends it to the product card
const addCartItemInput = parentElement =>
{
    const increaseQuantityButton = document.createElement("button");
    const increaseQuantityButtonClassList = ["button-cart-quantity", "increase-quantity"]
    increaseQuantityButton.classList.add(...increaseQuantityButtonClassList);
    increaseQuantityButton.innerText = "+";

    const decreaseQuantityButton = document.createElement("button");
    const decreaseQuantityButtonClassList = ["button-cart-quantity", "decrease-quantity"]
    decreaseQuantityButton.classList.add(...decreaseQuantityButtonClassList);
    decreaseQuantityButton.innerText = "-";

    const quantityInputDiv = document.createElement("div");
    quantityInputDiv.className = "cart-items-control";

    const quantityInput = document.createElement("input");
    quantityInput.value = 1;
    quantityInput.type = "number";
    quantityInput.step = 1;
    quantityInput.min = 0;
    quantityInput.disabled = "disabled";
    quantityInput.className = "input-cart-quantity";

    quantityInputDiv.append(decreaseQuantityButton, quantityInput, increaseQuantityButton);
    parentElement.append(quantityInputDiv);

}

//adds ability to open and close shopping cart modal
const addModalEventListeners = () =>
{
    const modalCloseButton = document.querySelector(".close-cart-modal");
    modalCloseButton.addEventListener("click", toggleModal);

    const modalOpenLink = document.querySelector(".cart-icon-container");
    modalOpenLink.addEventListener("click", toggleModal);
}

//hides modal by default on page load
const hideModalByDefault = () =>
{
    document.querySelector(".cart-modal-overlay").style.display = "none";

}

//toggles modal between being hidden and displaying depending on its previous state
const toggleModal = () =>
{
    const modal = document.querySelector(".cart-modal-overlay");
    const displayStatus = modal.style.display;
    if (displayStatus === "block")
    {
        modal.style.display = "none";
    } else if (displayStatus === "none")
    {
        modal.style.display = "block";
    }
}

//initialises cart to an empty array on page load
const initialiseCart = () =>
{
    if (!localStorage.getItem("cart"))
    {
        localStorage.setItem("cart", "[]");
    }

}

//adds cart item to local storage
// adds cart item to DOM
const addCartItemToLocalStorageCart = (shopItemContent, productId) =>
{
    const product = {};
    const productName = shopItemContent.querySelector('.shop-item-title').textContent;
    const productPrice = shopItemContent.querySelector('.shop-item-price').textContent;
    const productQuantity = shopItemContent.querySelector('.input-cart-quantity').value;
    const productImg = shopItemContent.parentElement.querySelector(".shop-item-img").src;

    product.id = productId;
    product.name = productName;
    product.price = productPrice;
    product.quantity = productQuantity;
    product.image = productImg;

    addCartItemDOM(product);

    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
}

//updates quantity of cart item in local storage
const updateQuantityLocalStorage = (productId, quantity) =>
{

    const cart = JSON.parse(localStorage.getItem("cart"));

    for (let product of cart)
    {
        if (product.id == productId)
        {
            product.quantity = quantity;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

}

//removes cart item from local storage
const removeCartItemFromLocalStorage = (productId) =>
{
    const cart = JSON.parse(localStorage.getItem("cart"));

    // returns new array with all items other than the item with a matching productid
    let temp = cart.filter(item => item.id != productId);
    localStorage.setItem("cart", JSON.stringify(temp));

}

const addCartItemDOM = (product) =>
{
    const cartitemList = document.querySelector(".cart-item-list");

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.dataset.id = product.id;

    cartItem.innerHTML = `
        <img class="cart-item-img" src="${product.image}" alt="${product.name}" />
        <p class="cart-item-description">${product.name}</p>
        <span class="cart-item-price">${product.price}</span>
        <div class="cart-item-quantity"></div>
    `;

    // Append the new cart item to the list
    cartitemList.appendChild(cartItem);

    const lastCartItemQuantity = cartItem.querySelector(".cart-item-quantity");
    addCartItemInput(lastCartItemQuantity);

}

const getCartTotal = () =>
{
    const cart = JSON.parse(localStorage.getItem("cart"));
    const total = cart.reduce((sum, product) =>
    {
        const price = parseFloat(product.price.replace('£', ''));
        const quantity = parseInt(product.quantity, 10);
        return sum + (price * quantity);
    }, 0);

    return total;
}

const displayCartTotal = (sum) =>
{
    const cartTotalElement = document.querySelector(".cart-subtotal");
    cartTotalElement.innerText = `£${sum.toFixed(2)}`;
}