
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
}



// When the add button is clicked for a specific product id
// the add button is removed from that product item container
//it is replaced with the button + input + button pattern in that product item container

