from selenium import webdriver
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pytest
import random

URL = "https://gabrielrowan.github.io/Finleys-Farm-Shop-FE/products.html"

@pytest.fixture()  
def chrome_browser():  
    driver = webdriver.Chrome()  
    driver.implicitly_wait(10)  
    yield driver  
    driver.quit()

@pytest.fixture()
def shop_page(chrome_browser):
    chrome_browser.get(URL)
    return chrome_browser 

# Ensures that cart stored in session doesn't hold any items for the beginning of testing
def set_empty_cart(shop_page):
    cart = shop_page.execute_script("return sessionStorage.getItem('cart');")
    if len(cart) != 0:
        shop_page.execute_script("sessionStorage.setItem('cart', '[]');")

def get_cart(shop_page):
    cart = shop_page.execute_script("return sessionStorage.getItem('cart');")
    return cart 

def test_title(shop_page):
    assert "Finley's Farm Shop" in shop_page.title

def test_add_button_count_matches_product_count(shop_page):
    add_buttons = shop_page.find_elements(By.CLASS_NAME, "add-to-cart")
    products = shop_page.find_elements(By.CLASS_NAME, "shop-item")
    assert len(add_buttons) == len(products)

def test_quantity_buttons_not_visible_on_initial_pageload(shop_page):
    quantity_buttons = shop_page.find_elements(By.CLASS_NAME, "cart-items-control")
    assert len(quantity_buttons) == 0

def test_trolley_cart_count_is_zero_when_cart_empty(shop_page):
    cart_count = shop_page.find_element(By.CLASS_NAME, "cart-count").text
    assert int(cart_count) == 0

def test_trolley_modal_can_open(shop_page):
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()
    trolley_modal = shop_page.find_element(By.CLASS_NAME, "cart-modal-overlay")
    classes = trolley_modal.get_attribute("class")

    assert "active" in classes

def test_trolley_empty_message(shop_page):
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()
    trolley_empty_text = shop_page.find_element(By.CLASS_NAME, "trolley-empty-text").text
    assert trolley_empty_text == "Your trolley is empty"

def test_trolley_subtotal_is_zero_when_cart_empty(shop_page):
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()
    cart_subtotal = shop_page.find_element(By.CLASS_NAME, "cart-subtotal").text.replace("£", "")
    assert float(cart_subtotal) == 0.00

def test_trolley_zero_items_when_cart_empty(shop_page):
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()
    cart_item_text = shop_page.find_element(By.CLASS_NAME, "cart-header-title").text
    cart_item_count = "".join(filter(str.isdigit, cart_item_text))
    assert int(cart_item_count) == 0 

def test_add_product_item_updates_trolley_count(shop_page):
    cart_count_before = shop_page.find_element(By.CLASS_NAME, "cart-count").text
    add_buttons = shop_page.find_elements(By.CLASS_NAME, "add-to-cart")
    product_count = len(add_buttons)
    random_product_item = random.randint(0, product_count - 1)
    add_buttons[random_product_item].click()
    cart_count_after = shop_page.find_element(By.CLASS_NAME, "cart-count").text

    assert int(cart_count_after) == (int(cart_count_before) + 1)

def test_product_added_to_cart_modal(shop_page):
    add_buttons = shop_page.find_elements(By.CLASS_NAME, "add-to-cart")
    product_names = shop_page.find_elements(By.CLASS_NAME, "shop-item-title")
    product_count = len(add_buttons)
    random_product_item = random.randint(0, product_count - 1)
    add_buttons[random_product_item].click()
    product_name = product_names[random_product_item].text
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()
    cart_item_name = shop_page.find_element(By.CLASS_NAME, "cart-item-description").text

    assert cart_item_name == product_name
