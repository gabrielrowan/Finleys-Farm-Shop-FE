//If I click on the increae quantity button it adds 1 to the quantity


// Checks if DOM is ready before executing javascript referencing DOM elements
document.addEventListener("DOMContentLoaded", function ()
{
    addAddButtonFunctionality();

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

const increaseQuantity = (buttonParent, event) =>
{
    const quantityInput = buttonParent.querySelector(".input-cart-quantity");
    console.log(quantityInput);
    const currentQuantity = parseInt(quantityInput.value);
    quantityInput.value = currentQuantity + 1;

}

// Adds functionality to increase quantity button
const addIncreaseQuantityButtonFunctionality = (buttonParent, event) =>
{
    const increaseQuantityButton = buttonParent.querySelector(".increase-quantity");
    increaseQuantityButton.addEventListener("click", increaseQuantity(buttonParent, event));

}


// Removes add button from product card and replaces it with quantity input controls
// Increases cart count by 1
const addButtonClicked = event =>
{
    const buttonParent = event.target.parentElement;
    const addButton = buttonParent.getElementsByClassName("add-to-cart")[0];
    addButton.remove();
    addCartItemInput(buttonParent);
    addItemToCart();
    addIncreaseQuantityButtonFunctionality(buttonParent, event);
}

//Increases total cart item count by 1
const addItemToCart = () =>
{
    const cartCountElement = document.getElementById("cart-count");
    const currentCartCount = parseInt(cartCountElement.innerText);
    cartCountElement.innerText = currentCartCount + 1;

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
    quantityInput.className = "input-cart-quantity";

    quantityInputDiv.append(decreaseQuantityButton, quantityInput, increaseQuantityButton);
    parentElement.append(quantityInputDiv);

}

