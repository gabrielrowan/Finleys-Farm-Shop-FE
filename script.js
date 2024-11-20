//If I click on the add button, the cart total increases by 1


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


// Removes add button from product card and replaces it with quantity input controls
// Increases cart count by 1
const addButtonClicked = event =>
{
    const buttonParent = event.target.parentElement;
    const addButton = buttonParent.getElementsByClassName("add-to-cart")[0];
    addButton.remove();
    addCartItemInput(buttonParent);
    addItemToCart();
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
    increaseQuantityButton.className = "button-cart-quantity";
    increaseQuantityButton.innerText = "+";

    const decreaseQuantityButton = document.createElement("button");
    decreaseQuantityButton.className = "button-cart-quantity";
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

