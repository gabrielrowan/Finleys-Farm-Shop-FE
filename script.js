//If I click on the increae quantity button it adds 1 to the quantity


// Checks if DOM is ready before executing javascript referencing DOM elements
document.addEventListener("DOMContentLoaded", function ()
{
    hideModalByDefault();
    addAddButtonFunctionality();
    addModalEventListeners();

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
const changeQuantity = (changeType, event, addButton) =>
{
    const quantityInput = event.target.parentElement.querySelector(".input-cart-quantity");
    const currentQuantity = parseInt(quantityInput.value);
    const maxQuantity = 15;

    switch (changeType)
    {
        case ("add"):
            quantityInput.value = currentQuantity + 1;
            if ((currentQuantity + 1) > maxQuantity)
            {
                quantityInput.value = maxQuantity;
            }
            break;
        case ("subtract"):
            quantityInput.value = currentQuantity - 1;
            if ((currentQuantity - 1) == 0)
            {
                event.target.parentElement.remove();
                addButton.style.display = "block";
                changeCartItemTotal("subtract");
            }
            break;
    }
}

// Adds functionality to increase quantity button
const addQuantityButtonsFunctionality = (buttonParent, addButton) =>
{
    const increaseQuantityButton = buttonParent.querySelector(".increase-quantity");
    increaseQuantityButton.addEventListener("click", (event) => changeQuantity("add", event, addButton));
    const decreaseQuantityButton = buttonParent.querySelector(".decrease-quantity");
    decreaseQuantityButton.addEventListener("click", (event) => changeQuantity("subtract", event, addButton));

}


// Removes add button from product card and replaces it with quantity input controls
// Increases cart count by 1
// Adds functionality to quantity buttons so that they can increase and decrease by 1
const addButtonClicked = event =>
{
    const buttonParent = event.target.parentElement;
    const addButton = buttonParent.querySelector(".add-to-cart");
    addButton.style.display = "none";
    addCartItemInput(buttonParent);
    changeCartItemTotal("add");
    addQuantityButtonsFunctionality(buttonParent, addButton);
}

//changeType can be "add" or "subtract". Depending on changeType, cartItemTotal is increased or decreased by 1
const changeCartItemTotal = changeType =>
{
    const cartCountElement = document.getElementById("cart-count");
    const currentCartCount = parseInt(cartCountElement.innerText);

    switch (changeType)
    {
        case ("add"):
            cartCountElement.innerText = currentCartCount + 1;
            break;
        case ("subtract"):
            cartCountElement.innerText = currentCartCount - 1;

    }


}

const removeItemFromCart = () =>
{
    const cartCountElement = document.getElementById("cart-count");
    const currentCartCount = parseInt(cartCountElement.innerText);
    cartCountElement.innerText = currentCartCount - 1;
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

const addModalEventListeners = () =>
{
    const modalCloseButton = document.querySelector(".close-cart-modal");
    modalCloseButton.addEventListener("click", closeCartModal);

    const modalOpenLink = document.querySelector(".cart-icon-container");
    modalOpenLink.addEventListener("click", openCartModal);
}

const hideModalByDefault = () =>
{
    document.querySelector(".cart-modal-overlay").style.display = "none";

}

const openCartModal = () =>
{
    document.querySelector(".cart-modal-overlay").style.display = "block";
}

const closeCartModal = (event) =>
{
    document.querySelector(".cart-modal-overlay").style.display = "none";
}