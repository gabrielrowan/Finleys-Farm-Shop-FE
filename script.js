
document.addEventListener("DOMContentLoaded", function ()
{
    const addButtons = document.getElementsByClassName("add-to-cart");
    for (let i = 0; i < addButtons.length; i++)
    {
        const button = addButtons[i];
        button.addEventListener("click", addButtonClicked);
    }

});


// Select all the add buttons by class name 
// Loop over all the add buttons
// Add an event listener to each add button
// In this event listener, call a function that does the following: 
// Removes the add button from its parent element
// Adds in its place the remove button + input + add button combination 



const addButtonClicked = (event) =>
{
    const buttonParent = event.target.parentElement;
    const addButton = buttonParent.getElementsByClassName("add-to-cart")[0];
    addButton.remove();
    addCartItemInput(buttonParent);
}

const addCartItemInput = (parentElement) =>
{
    const increaseQuantityButton = document.createElement('button');
    increaseQuantityButton.className = "button-cart-quantity";
    const decreaseQuantityButton = document.createElement('button');
    decreaseQuantityButton.className = "button-cart-quantity";
    increaseQuantityButton.innerText = "+";
    decreaseQuantityButton.innerText = "-";
    const quantityInput = document.createElement('input');
    const quantityInputDiv = document.createElement('div');
    quantityInputDiv.className = 'cart-items-control';
    quantityInput.value = 1;
    quantityInput.type = "number";
    quantityInput.step = 1;
    quantityInput.min = 0;
    quantityInput.className = "input-cart-quantity";
    quantityInputDiv.append(decreaseQuantityButton, quantityInput, increaseQuantityButton);
    parentElement.append(quantityInputDiv);

}

/*
<button class="button-cart-quantity">-</button>
<input class="input-cart-quantity" type="number" value="1" step="1" min="0"></input>
<button class="button-cart-quantity">+</button>*/


// When the add button is clicked for a specific product id
// the add button is removed from that product item container
//it is replaced with the button + input + button pattern in that product item container

