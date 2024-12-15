// Checks if DOM is ready before executing javascript referencing DOM elements
document.addEventListener("DOMContentLoaded", function ()
{
    addAddButtonFunctionality();
    addModalEventListeners();
    loadCartState();

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

// Change quantity of cart item - changeType can be "add" or "subtract"
const changeQuantity = (changeType, productId) =>
{
    const containerElement = document.querySelector(`.shop-items`);
    const matchingCartItem = containerElement.querySelector(`[data-id="${productId}"]`);
    const quantityInput = matchingCartItem.querySelector(".input-cart-quantity");
    const currentQuantity = parseInt(quantityInput.value);
    const maxQuantity = 50;
    let updatedQuantity = 0;

    switch (changeType)
    {
        case ("add"):
            updatedQuantity = Math.min(currentQuantity + 1, maxQuantity);
            syncQuantityInputValue(updatedQuantity, productId);
            break;

        case ("subtract"):
            updatedQuantity = currentQuantity - 1;
            break;
    }

    syncQuantityInputValue(updatedQuantity, productId);

    if (updatedQuantity === 0)
    {
        //when quantity of cart item is 0, item is removed from modal DOM and local storage
        //the quantity plus and minus buttons revert back to the add button
        returnToCartAddButton(matchingCartItem);
        changeCartItemTotal("subtract");
        removeCartItemFromLocalStorage(productId);
        removeCartItemFromModalDOM(productId);

    }
    else
    {
        //only update quantity if item has not been removed from cart
        updateQuantityLocalStorage(productId, updatedQuantity);
    }

    getAndDisplayCartTotalPrice();
}

//ensures that the quantity displayed for the same cart item in both places (product list and modal) is the same
const syncQuantityInputValue = (updatedQuantity, productId) =>
{
    const cartItemListModalClassName = "cart-item-list";
    const cartItemProductList = "shop-items";
    updateQuantityInputValue(cartItemListModalClassName, productId, updatedQuantity);
    updateQuantityInputValue(cartItemProductList, productId, updatedQuantity);

}

//updates quantity for cart item in product list and in cart modal
const updateQuantityInputValue = (containerElementClassName, productId, updatedQuantity) =>
{
    const containerElement = document.querySelector(`.${containerElementClassName}`);
    const matchingCartItem = containerElement.querySelector(`[data-id="${productId}"]`);
    const modalCartItemInputElement = matchingCartItem.querySelector(".input-cart-quantity");
    modalCartItemInputElement.value = updatedQuantity;
}

//Makes add button for cart item visible
const returnToCartAddButton = (parentElement) =>
{
    parentElement.querySelector(".cart-items-control").remove();
    const addButton = parentElement.querySelector(".add-to-cart");
    addButton.style.display = "block";

}

// Adds functionality to increase quantity button
const addQuantityButtonsFunctionality = (parentElement, productId) =>
{
    const increaseQuantityButton = parentElement.querySelector(".increase-quantity");
    increaseQuantityButton.addEventListener("click", () => changeQuantity("add", productId));
    const decreaseQuantityButton = parentElement.querySelector(".decrease-quantity");
    decreaseQuantityButton.addEventListener("click", () => changeQuantity("subtract", productId));

}


// Removes add button from product card and replaces it with quantity input controls
// Increases cart count by 1
// Adds functionality to quantity buttons so that they can increase and decrease by 1
// Adds cart item to local storage
// Updates and displays total price
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
    getAndDisplayCartTotalPrice();

}

//changeType can be "add" or "subtract". Depending on changeType, cartItemTotal is increased or decreased by 1
//calls function to change cart modal item count and cart count badge
const changeCartItemTotal = changeType =>
{
    const cart = JSON.parse(localStorage.getItem("cart"));
    let currentCartCount = cart.length;
    let updatedCartCount = 0;

    switch (changeType)
    {
        case ("add"):
            updatedCartCount = currentCartCount + 1;
            break;
        case ("subtract"):
            updatedCartCount = currentCartCount - 1;
    }

    toggleEmptyTrolleyMessage(updatedCartCount);
    displayCartItemCountDOM(updatedCartCount);

}


// Creates elements for quantity input controls and appends it to the product card
const addCartItemInput = (parentElement, quantity = 1) =>
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
    quantityInput.value = quantity;
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


//toggles modal between being hidden and displaying 
const toggleModal = () =>
{
    const modal = document.querySelector(".cart-modal-overlay");
    const body = document.body;
    modal.classList.toggle("active");

    if (modal.classList.contains("active"))
    {
        body.style.overflow = "hidden";
    } else
    {
        body.style.overflow = "auto";
    }
};

//initialises cart to an empty array on page load if cart array doesn't already exist
//loops over all products in cart and updates products in DOM to reflect that they have been added to the trolley
const loadCartState = () =>
{
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart)
    {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    cart.forEach(product =>
    {
        const shopItem = document.querySelector(`.shop-item[data-id="${product.id}"]`);

        //If a DOM item is found that matches a product added to local storage, then the product has already been added to the cart
        //This means that, instead of an add button, the quantity input controls need to show instead in the product list
        if (shopItem)
        {
            const shopItemContent = shopItem.querySelector(".shop-item-content");
            const addButton = shopItemContent.querySelector(".add-to-cart");

            // Hide "Add" button
            addButton.style.display = "none";

            // Add input controls
            addCartItemInput(shopItemContent, product.quantity);

            // Update quantity from localStorage
            const quantityInput = shopItemContent.querySelector(".input-cart-quantity");
            quantityInput.value = product.quantity;

            // Add functionality to increase/decrease buttons
            addQuantityButtonsFunctionality(shopItemContent, product.id);

            //add cart item to the DOM
            addCartItemToModalDOM(product);
        }
    });

    getAndDisplayCartTotalPrice();
    fetchCartItemCount();

}




// adds cart item to local storage
// adds cart item to DOM
const addCartItemToLocalStorageCart = (shopItemContent, productId) =>
{
    const productName = shopItemContent.querySelector('.shop-item-title').textContent;
    const productPrice = shopItemContent.querySelector('.shop-item-price').textContent;
    const productQuantity = shopItemContent.querySelector('.input-cart-quantity').value;
    const productImg = shopItemContent.parentElement.querySelector(".shop-item-img").src;

    const product = {};
    product.id = productId;
    product.name = productName;
    product.price = productPrice;
    product.quantity = productQuantity;
    product.image = productImg;

    const cart = JSON.parse(localStorage.getItem("cart"));

    //check if item has already been added to the cart first
    if (!cart.some((product) => product.id === productId))
    {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        addCartItemToModalDOM(product);
    }

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

//adds the HTML needed for a cart item to the modal
const addCartItemToModalDOM = (product) =>
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

    // Append the new cart item to the list of cart items in the modal
    cartitemList.appendChild(cartItem);

    const cartItemQuantity = cartItem.querySelector(".cart-item-quantity");
    addCartItemInput(cartItemQuantity, product.quantity);

    addQuantityButtonsFunctionality(cartItem, product.id);

}

//gets cart total price from local storage
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

//displays cart total price to 2 decimal places with '£' sign
const displayCartTotal = (sum) =>
{
    const cartTotalElement = document.querySelector(".cart-subtotal");
    cartTotalElement.innerText = `£${sum.toFixed(2)}`;
}

//removes cart item from modal
const removeCartItemFromModalDOM = (productId) =>
{
    const cartItemList = document.querySelector(".cart-item-list");
    const matchingModalCartItem = cartItemList.querySelector(`[data-id="${productId}"]`);
    if (matchingModalCartItem)
    {
        matchingModalCartItem.remove();
    }

}

// Updates the display of the cart item count in 2 places: 
// 1) The cart count badge by the trolley
// 2) The modal header 
const displayCartItemCountDOM = (cartCount) =>
{
    const modalCartCountElement = document.querySelector(".cart-header-title");
    const cartCountElement = document.querySelector(".cart-count");

    cartCountElement.innerText = cartCount;

    if (cartCount === 1)
    {
        modalCartCountElement.innerText = `Trolley (${cartCount} item)`;

    }
    else if (cartCount > 1)
    {
        modalCartCountElement.innerText = `Trolley (${cartCount} items)`;

    }
    else
    {
        modalCartCountElement.innerText = `Trolley (0 items)`;
    }
}

//fetches the amount of items in cart
//displays cart item count and, if cart count is 0, empty trolley message
const fetchCartItemCount = () =>
{
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartCount = cart.length;
    displayCartItemCountDOM(cartCount);
    toggleEmptyTrolleyMessage(cartCount);
}

//gets and displays price of total items in cart
const getAndDisplayCartTotalPrice = () =>
{
    const totalPrice = getCartTotal();
    displayCartTotal(totalPrice);
}

//displays empty trolley message in modal
const displayEmptyTrolleyMessage = () =>
{
    const modalContent = document.querySelector(".cart-item-list");
    modalContent.innerHTML =
        `<div class="trolley-empty-container">
            <p class="trolley-empty-text">Your trolley is empty </p>
        </div>`;
}

//removes empty trolley message from modal
const removeEmptyTrolleyMessage = () =>
{
    const modalContent = document.querySelector(".cart-item-list");
    const emptyTrolleyContainer = modalContent.querySelector(".trolley-empty-container");
    if (emptyTrolleyContainer)
    {
        emptyTrolleyContainer.remove();
    }

}

//Shows empty trolley message when cart count is 0
const toggleEmptyTrolleyMessage = (cartCount) =>
{
    if (cartCount === 0)
    {
        displayEmptyTrolleyMessage();
    }

    else
    {
        removeEmptyTrolleyMessage();
    }
}
