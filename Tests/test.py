from selenium import webdriver
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
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

# Helper classes start
def click_random_product_item(shop_page):
    add_buttons = WebDriverWait(shop_page, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "add-to-cart")))
    product_count = len(add_buttons)
    random_product_item = random.randint(0, product_count - 1)
    add_button_selected = WebDriverWait(shop_page, 30).until(
        EC.element_to_be_clickable((By.XPATH, f"(//button[@class='add-to-cart'])[{random_product_item + 1}]"))
    )

    add_button_selected.click()
    return random_product_item

def open_cart_trolley_modal(shop_page):
    cart_trolley = shop_page.find_element(By.CLASS_NAME, "cart-icon-container")
    cart_trolley.click()

def get_product_price(shop_page, product_number):
    products = shop_page.find_elements(By.CLASS_NAME, "shop-item")
    product = products[product_number]
    price = product.find_element(By.CLASS_NAME, "shop-item-price").text.replace("£", "")
    return float(price)

def get_cart_subtotal(shop_page):
    cart_subtotal = WebDriverWait(shop_page, 20).until(EC.visibility_of_element_located((By.CLASS_NAME, "cart-subtotal"))).text
    return float(cart_subtotal.replace("£", ""))

def get_trolley_modal_title_item_count(shop_page):
    open_cart_trolley_modal(shop_page)
    cart_item_text = shop_page.find_element(By.CLASS_NAME, "cart-header-title").text
    cart_item_count = "".join(filter(str.isdigit, cart_item_text))
    return int(cart_item_count)

def compare_trolley_count_difference(shop_page, product_item_count):
    cart_count_before = get_cart_item_count(shop_page)
    for i in range(product_item_count):
        click_random_product_item(shop_page)
    cart_count_after = get_cart_item_count(shop_page)
    return cart_count_before,cart_count_after

def remove_first_modal_cart_item(shop_page):
    modal_cart_items = shop_page.find_element(By.CLASS_NAME, "cart-item-list")
    remove_button = modal_cart_items.find_elements(By.CLASS_NAME, "decrease-quantity")[0]
    remove_button.click()

def get_cart_item_count(shop_page):
    return int(shop_page.find_element(By.CLASS_NAME, "cart-count").text)

def get_cart_item_price(item):
    str_price = item.find_element(By.CLASS_NAME, "cart-item-price").text
    flt_price = float(str_price.replace("£", ""))
    return flt_price

def click_increase_quantity_shop_item_button(shop_page, increase_quantity_button):
    shop_page.execute_script("arguments[0].click();", increase_quantity_button)

def click_decrease_quantity_shop_item_button(shop_page, decrease_quantity_button):
    shop_page.execute_script("arguments[0].click();", decrease_quantity_button)

# Helper classes end 

# Testing initial page load 
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
    cart_count = get_cart_item_count(shop_page)
    assert cart_count == 0

def test_trolley_modal_can_open(shop_page):
    open_cart_trolley_modal(shop_page)
    trolley_modal = shop_page.find_element(By.CLASS_NAME, "cart-modal-overlay")
    classes = trolley_modal.get_attribute("class")
    assert "active" in classes

def test_trolley_empty_message(shop_page):
    open_cart_trolley_modal(shop_page)
    trolley_empty_text = shop_page.find_element(By.CLASS_NAME, "trolley-empty-text").text
    assert trolley_empty_text == "Your trolley is empty"

def test_trolley_subtotal_is_zero_when_cart_empty(shop_page):
    open_cart_trolley_modal(shop_page)
    cart_subtotal = get_cart_subtotal(shop_page)
    assert cart_subtotal == 0.00

def test_trolley_zero_items_when_cart_empty(shop_page):
    cart_item_count = get_trolley_modal_title_item_count(shop_page)
    assert cart_item_count == 0 


# Testing adding items
def test_trolley_count_increases_by_1_when_product_added(shop_page):
    cart_count_before, cart_count_after = compare_trolley_count_difference(shop_page, 1)
    assert int(cart_count_after) == (int(cart_count_before) + 1)


def test_trolley_count_increases_by_2_when_2_products_added(shop_page):
    cart_count_before, cart_count_after = compare_trolley_count_difference(shop_page, 2)
    assert int(cart_count_after) == (int(cart_count_before) + 2)

def test_product_added_to_cart_modal(shop_page):
    product_names = shop_page.find_elements(By.CLASS_NAME, "shop-item-title")
    product_clicked = click_random_product_item(shop_page)
    product_name = product_names[product_clicked].text
    open_cart_trolley_modal(shop_page)
    cart_item_name = shop_page.find_element(By.CLASS_NAME, "cart-item-description").text
    assert cart_item_name == product_name

def test_empty_trolley_message_disappears_when_item_added(shop_page):
    click_random_product_item(shop_page)
    try: 
        shop_page.find_element(By.CLASS_NAME, "trolley-empty-text")
        # Empty message should not exist when item has been added
        assert False
    except NoSuchElementException:
        pass 
    

def test_subtotal_updated_when_product_added(shop_page):
    product_clicked = click_random_product_item(shop_page)
    product_price = get_product_price(shop_page, product_clicked)
    open_cart_trolley_modal(shop_page)
    cart_subtotal = get_cart_subtotal(shop_page)
    assert product_price == cart_subtotal 

def test_subtotal_updated_when_2_products_added(shop_page):
    product_clicked = click_random_product_item(shop_page)
    product_price = get_product_price(shop_page, product_clicked)
    second_product_clicked = click_random_product_item(shop_page)
    second_product_price = get_product_price(shop_page, second_product_clicked)
    sum_of_products = product_price + second_product_price
    open_cart_trolley_modal(shop_page)
    cart_subtotal = get_cart_subtotal(shop_page)
    assert cart_subtotal == float(sum_of_products)

def test_trolley_title_item_count_increases_to_1_when_product_added(shop_page):
    click_random_product_item(shop_page)
    trolley_item_count = get_trolley_modal_title_item_count(shop_page)
    assert trolley_item_count == 1

def test_trolley_title_item_count_increases_to_2_when_2_products_added(shop_page):
    for i in range(2):
        click_random_product_item(shop_page)
    trolley_item_count = get_trolley_modal_title_item_count(shop_page)
    assert trolley_item_count == 2

# Testing quantity controls
def test_product_quantity_starts_at_1(shop_page):
    click_random_product_item(shop_page)
    quantity_value = shop_page.find_element(By.CLASS_NAME, "input-cart-quantity").get_attribute('value')
    assert int(quantity_value) == 1

def test_increase_quantity_button_increases_quantity(shop_page):
    click_random_product_item(shop_page)
    increase_quantity_button = shop_page.find_element(By.CLASS_NAME, "increase-quantity")
    # slightly overlapping elements so need to use different click method
    shop_page.execute_script("arguments[0].click();", increase_quantity_button)
    quantity_value = shop_page.find_element(By.CLASS_NAME, "input-cart-quantity").get_attribute('value')

    assert int(quantity_value) == 2

def test_decrease_quantity_button_decreases_quantity(shop_page):
    click_random_product_item(shop_page)
    increase_quantity_button = shop_page.find_element(By.CLASS_NAME, "increase-quantity")
    # set quantity to 4
    for i in range(0, 3):
        click_increase_quantity_shop_item_button(shop_page, increase_quantity_button)

    decrease_quantity_button = shop_page.find_element(By.CLASS_NAME, "decrease-quantity")
    click_decrease_quantity_shop_item_button(shop_page, decrease_quantity_button)

    # slightly overlapping elements so need to use different click method
    quantity_value = shop_page.find_element(By.CLASS_NAME, "input-cart-quantity").get_attribute('value')

    assert int(quantity_value) == 3


# Removing products
def test_subtotal_0_when_only_product_removed_in_modal(shop_page):
    click_random_product_item(shop_page)
    open_cart_trolley_modal(shop_page)
    remove_first_modal_cart_item(shop_page)
    cart_subtotal = get_cart_subtotal(shop_page)
    assert int(cart_subtotal) == 0


def test_subtotal_decreases_when_product_removed_in_modal(shop_page):
    # add 2 products
    for i in range(0, 2):
        click_random_product_item(shop_page)
    open_cart_trolley_modal(shop_page)
    # get subtotal before removing a product
    cart_subtotal_before = get_cart_subtotal(shop_page)
    modal_cart_items = shop_page.find_element(By.CLASS_NAME, "cart-item-list")
    cart_items = modal_cart_items.find_elements(By.CLASS_NAME, "cart-item")
    # get the prices of all items in the cart
    prices = []
    for item in cart_items:
        flt_price = get_cart_item_price(item)
        prices.append(flt_price)
    remove_first_modal_cart_item(shop_page)
    cart_subtotal_after = get_cart_subtotal(shop_page)
    assert cart_subtotal_after == pytest.approx(cart_subtotal_before - prices[0])

# Testing sessions

def test_subtotal_does_not_reset_when_page_refreshed(shop_page):

    click_random_product_item(shop_page)
    open_cart_trolley_modal(shop_page)
    subtotal_pre_refresh = get_cart_subtotal(shop_page)
    shop_page.refresh()
    open_cart_trolley_modal(shop_page)
    subtotal_post_refresh = get_cart_subtotal(shop_page)

    assert subtotal_pre_refresh == subtotal_post_refresh

def test_cart_item_total_does_not_reset_when_page_refreshed(shop_page):

    open_cart_trolley_modal(shop_page)
    cart_count_pre_refresh = get_cart_item_count(shop_page)
    shop_page.refresh()
    cart_count_post_refresh = get_cart_item_count(shop_page)

    assert cart_count_pre_refresh == cart_count_post_refresh