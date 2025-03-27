
![finleys-banner](https://github.com/user-attachments/assets/93ccd785-aecf-4fd6-8c90-7bf8bf0fd575)

# Finley's Farm Shop


## Deployment

To have a click around, the live link for this project is: [https://gabrielrowan.github.io/Finleys-Farm-Shop-FE/](https://gabrielrowan.github.io/Finleys-Farm-Shop-FE/)

## Technologies

This is a front end project using:

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Testing for the project uses:

![Selenium](https://img.shields.io/badge/-selenium-%43B02A?style=for-the-badge&logo=selenium&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3)


## Overview

- Fully responsive front-end shopping cart application for a farm shop
- Built with HTML, CSS, and JavaScript, adapting to desktop, iPad, and mobile screens
- Allows users to add and remove products, update quantities, and view the total price
- Designed with warm, earthy tones to reflect the farm shop theme
- Tested using Selenium WebDriver with Pytest to automate user interactions

## Testing

The testing for this project focuses on the products webpage. Here is a (non-exhaustive) list of what the tests cover:
- Checking that the default values on initial page load are as expected, such as the cart being empty
- That adding a product updates the total
- That removing a product updates the total
- That the increase quantity button increases the quantity of product
- That the decrease quantity button decreases the quantity of a product
- That it is possible to refresh the page and have the items remain in the cart, instead of being reset to 0

The tests can be viewed in the `/Tests` folder

## Mobile: 

Item being added to the cart in mobile view:

![radishes being added to the cart - mobile view ](https://github.com/user-attachments/assets/ce36db74-08e5-4ad2-b8a7-94b7b57b290b)

## Desktop 

Desktop shopping cart open view: 

![trolley modal open - desktop view](https://github.com/user-attachments/assets/af5bb155-7e9d-4704-908e-04fb395ac980)



