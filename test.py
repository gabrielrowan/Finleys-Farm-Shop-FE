from selenium import webdriver
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pytest

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

def test_title(shop_page):
    assert "Finley's Farm Shop" in shop_page.title

def test_add_button_count_matches_product_count(shop_page):
    add_buttons = shop_page.find_elements(By.CLASS_NAME, "add-to-cart")
    products = shop_page.find_elements(By.CLASS_NAME, "shop-item")
    assert len(add_buttons) == len(products)

# Ensures that cart stored in session doesn't hold any items for the beginning of testing
def set_empty_cart(shop_page):
    cart = shop_page.execute_script("return sessionStorage.getItem('cart');")
    if len(cart) != 0:
        shop_page.execute_script("sessionStorage.setItem('cart', '[]');")