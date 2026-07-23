import os
import sys
import django
import random
from decimal import Decimal
import urllib.parse

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from food.models import Category, FoodItem, Hero, OfferBanner

def clear_db():
    print("Deleting existing records...")
    FoodItem.objects.all().delete()
    Category.objects.all().delete()
    Hero.objects.all().delete()
    OfferBanner.objects.all().delete()

# All image URLs are verified Unsplash food-only photos
CATEGORIES = [
    {
        "name": "Pizza",
        "slug": "pizza",
        "description": "Authentic Italian pizzas with premium toppings.",
        "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
        "items": [
            {"name": "Margherita Pizza",      "price": 600,  "type": "veg",     "spicy": 0, "cal": 780, "time": 20, "url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"},
            {"name": "Chicken Tikka Pizza",   "price": 850,  "type": "non_veg", "spicy": 2, "cal": 920, "time": 25, "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"},
            {"name": "Veggie Supreme Pizza",  "price": 700,  "type": "veg",     "spicy": 1, "cal": 700, "time": 20, "url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80"},
            {"name": "Pepperoni Pizza",       "price": 950,  "type": "non_veg", "spicy": 2, "cal": 1050,"time": 25, "url": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80"},
            {"name": "Cheese Burst Pizza",    "price": 1100, "type": "veg",     "spicy": 0, "cal": 1200,"time": 30, "url": "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80"},
        ]
    },
    {
        "name": "Burgers",
        "slug": "burgers",
        "description": "Juicy, mouth-watering burgers with fresh ingredients.",
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        "items": [
            {"name": "Chicken Burger",        "price": 450,  "type": "non_veg", "spicy": 1, "cal": 550, "time": 15, "url": "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=800&q=80"},
            {"name": "Beef Burger",           "price": 550,  "type": "non_veg", "spicy": 1, "cal": 680, "time": 15, "url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"},
            {"name": "Double Cheese Burger",  "price": 650,  "type": "non_veg", "spicy": 1, "cal": 850, "time": 20, "url": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80"},
            {"name": "Veg Burger",            "price": 350,  "type": "veg",     "spicy": 0, "cal": 420, "time": 15, "url": "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80"},
            {"name": "Crispy Chicken Burger", "price": 500,  "type": "non_veg", "spicy": 2, "cal": 620, "time": 20, "url": "https://images.unsplash.com/photo-1594212202875-5154ee0d20d3?w=800&q=80"},
        ]
    },
    {
        "name": "Momo",
        "slug": "momo",
        "description": "Authentic Nepalese dumplings served with spicy chutney.",
        "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
        "items": [
            {"name": "Chicken Momo",          "price": 250,  "type": "non_veg", "spicy": 2, "cal": 320, "time": 20, "url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80"},
            {"name": "Buff Momo",             "price": 220,  "type": "non_veg", "spicy": 2, "cal": 310, "time": 20, "url": "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=800&q=80"},
            {"name": "Veg Momo",              "price": 200,  "type": "veg",     "spicy": 1, "cal": 250, "time": 20, "url": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80"},
            {"name": "Fried Momo",            "price": 300,  "type": "non_veg", "spicy": 2, "cal": 400, "time": 25, "url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80"},
            {"name": "Jhol Momo",             "price": 320,  "type": "non_veg", "spicy": 3, "cal": 380, "time": 25, "url": "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80"},
        ]
    },
    {
        "name": "Biryani",
        "slug": "biryani",
        "description": "Aromatic basmati rice cooked with exotic spices.",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
        "items": [
            {"name": "Chicken Biryani",       "price": 450,  "type": "non_veg", "spicy": 2, "cal": 650, "time": 35, "url": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=800&q=80"},
            {"name": "Mutton Biryani",        "price": 650,  "type": "non_veg", "spicy": 3, "cal": 750, "time": 45, "url": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80"},
            {"name": "Veg Biryani",           "price": 350,  "type": "veg",     "spicy": 1, "cal": 520, "time": 30, "url": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&q=80"},
            {"name": "Hyderabadi Biryani",    "price": 550,  "type": "non_veg", "spicy": 3, "cal": 720, "time": 40, "url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80"},
            {"name": "Special Biryani",       "price": 700,  "type": "non_veg", "spicy": 2, "cal": 780, "time": 45, "url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80"},
        ]
    },
    {
        "name": "Chicken",
        "slug": "chicken",
        "description": "Crispy, juicy, and perfectly cooked chicken dishes.",
        "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
        "items": [
            {"name": "Fried Chicken",         "price": 650,  "type": "non_veg", "spicy": 1, "cal": 720, "time": 25, "url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80"},
            {"name": "Chicken Wings",         "price": 550,  "type": "non_veg", "spicy": 2, "cal": 620, "time": 25, "url": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80"},
            {"name": "Chicken Lollipop",      "price": 450,  "type": "non_veg", "spicy": 3, "cal": 480, "time": 30, "url": "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80"},
            {"name": "Roast Chicken",         "price": 1200, "type": "non_veg", "spicy": 1, "cal": 950, "time": 50, "url": "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80"},
            {"name": "BBQ Chicken",           "price": 850,  "type": "non_veg", "spicy": 2, "cal": 800, "time": 35, "url": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80"},
        ]
    },
    {
        "name": "Pasta",
        "slug": "pasta",
        "description": "Creamy and delicious Italian pasta dishes.",
        "image_url": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
        "items": [
            {"name": "White Sauce Pasta",     "price": 450,  "type": "veg",     "spicy": 0, "cal": 550, "time": 20, "url": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"},
            {"name": "Red Sauce Pasta",       "price": 400,  "type": "veg",     "spicy": 1, "cal": 480, "time": 20, "url": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80"},
            {"name": "Alfredo Pasta",         "price": 550,  "type": "veg",     "spicy": 0, "cal": 620, "time": 25, "url": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80"},
            {"name": "Chicken Pasta",         "price": 600,  "type": "non_veg", "spicy": 1, "cal": 680, "time": 25, "url": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80"},
            {"name": "Cheese Pasta",          "price": 500,  "type": "veg",     "spicy": 0, "cal": 590, "time": 20, "url": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80"},
        ]
    },
    {
        "name": "Sandwich",
        "slug": "sandwich",
        "description": "Freshly made sandwiches for a quick bite.",
        "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
        "items": [
            {"name": "Club Sandwich",         "price": 450,  "type": "non_veg", "spicy": 1, "cal": 550, "time": 15, "url": "https://images.unsplash.com/photo-1567234669004-d06d129b1b50?w=800&q=80"},
            {"name": "Grilled Cheese",        "price": 300,  "type": "veg",     "spicy": 0, "cal": 420, "time": 10, "url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80"},
            {"name": "Chicken Sandwich",      "price": 400,  "type": "non_veg", "spicy": 1, "cal": 480, "time": 15, "url": "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=800&q=80"},
            {"name": "Veg Sandwich",          "price": 250,  "type": "veg",     "spicy": 0, "cal": 320, "time": 10, "url": "https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80"},
            {"name": "Paneer Sandwich",       "price": 350,  "type": "veg",     "spicy": 1, "cal": 400, "time": 15, "url": "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=800&q=80"},
        ]
    },
    {
        "name": "Rolls",
        "slug": "rolls",
        "description": "Tasty and filling wraps and rolls.",
        "image_url": "https://images.unsplash.com/photo-1626804475297-41609ea0c4eb?w=800&q=80",
        "items": [
            {"name": "Chicken Roll",          "price": 250,  "type": "non_veg", "spicy": 2, "cal": 380, "time": 15, "url": "https://images.unsplash.com/photo-1626804475297-41609ea0c4eb?w=800&q=80"},
            {"name": "Paneer Roll",           "price": 220,  "type": "veg",     "spicy": 1, "cal": 350, "time": 15, "url": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80"},
            {"name": "Egg Roll",              "price": 180,  "type": "non_veg", "spicy": 1, "cal": 310, "time": 10, "url": "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800&q=80"},
            {"name": "Veg Roll",              "price": 150,  "type": "veg",     "spicy": 0, "cal": 280, "time": 10, "url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80"},
            {"name": "BBQ Roll",              "price": 300,  "type": "non_veg", "spicy": 2, "cal": 420, "time": 20, "url": "https://images.unsplash.com/photo-1562059390-a761a084768e?w=800&q=80"},
        ]
    },
    {
        "name": "Cake",
        "slug": "cake",
        "description": "Sweet, fluffy, and perfectly baked cakes.",
        "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        "items": [
            {"name": "Chocolate Cake",        "price": 1200, "type": "veg",     "spicy": 0, "cal": 450, "time": 0,  "url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"},
            {"name": "Red Velvet Cake",       "price": 1400, "type": "veg",     "spicy": 0, "cal": 480, "time": 0,  "url": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80"},
            {"name": "Vanilla Cake",          "price": 1000, "type": "veg",     "spicy": 0, "cal": 380, "time": 0,  "url": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80"},
            {"name": "Black Forest Cake",     "price": 1300, "type": "veg",     "spicy": 0, "cal": 420, "time": 0,  "url": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80"},
            {"name": "Butterscotch Cake",     "price": 1100, "type": "veg",     "spicy": 0, "cal": 400, "time": 0,  "url": "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80"},
        ]
    },
    {
        "name": "Ice Cream",
        "slug": "ice-cream",
        "description": "Cool and refreshing ice cream flavors.",
        "image_url": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80",
        "items": [
            {"name": "Vanilla Scoop",         "price": 200,  "type": "veg",     "spicy": 0, "cal": 200, "time": 5,  "url": "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&q=80"},
            {"name": "Chocolate Cone",        "price": 250,  "type": "veg",     "spicy": 0, "cal": 280, "time": 5,  "url": "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=800&q=80"},
            {"name": "Strawberry Scoop",      "price": 220,  "type": "veg",     "spicy": 0, "cal": 220, "time": 5,  "url": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80"},
            {"name": "Mango Splash",          "price": 250,  "type": "veg",     "spicy": 0, "cal": 240, "time": 5,  "url": "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800&q=80"},
            {"name": "Butterscotch Sundae",   "price": 300,  "type": "veg",     "spicy": 0, "cal": 350, "time": 10, "url": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80"},
        ]
    },
    {
        "name": "Coffee",
        "slug": "coffee",
        "description": "Freshly brewed coffee to energize your day.",
        "image_url": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
        "items": [
            {"name": "Cappuccino",            "price": 250,  "type": "veg",     "spicy": 0, "cal": 120, "time": 10, "url": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80"},
            {"name": "Cafe Latte",            "price": 220,  "type": "veg",     "spicy": 0, "cal": 100, "time": 10, "url": "https://images.unsplash.com/photo-1579093370356-8a8b11155dc8?w=800&q=80"},
            {"name": "Espresso",              "price": 180,  "type": "veg",     "spicy": 0, "cal": 60,  "time": 5,  "url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80"},
            {"name": "Mocha",                 "price": 280,  "type": "veg",     "spicy": 0, "cal": 160, "time": 10, "url": "https://images.unsplash.com/photo-1529892485649-6407a8a68967?w=800&q=80"},
            {"name": "Cold Coffee",           "price": 300,  "type": "veg",     "spicy": 0, "cal": 200, "time": 10, "url": "https://images.unsplash.com/photo-1461023058943-0708e5c14abc?w=800&q=80"},
        ]
    },
    {
        "name": "Soft Drinks",
        "slug": "soft-drinks",
        "description": "Chilled and refreshing beverages.",
        "image_url": "https://images.unsplash.com/photo-1527960471264-932f2fb4a2f5?w=800&q=80",
        "items": [
            {"name": "Coca Cola",             "price": 100,  "type": "veg",     "spicy": 0, "cal": 140, "time": 2,  "url": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80"},
            {"name": "Pepsi",                 "price": 100,  "type": "veg",     "spicy": 0, "cal": 140, "time": 2,  "url": "https://images.unsplash.com/photo-1629203851288-7ececa5f25eb?w=800&q=80"},
            {"name": "Sprite",                "price": 100,  "type": "veg",     "spicy": 0, "cal": 130, "time": 2,  "url": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80"},
            {"name": "Fanta",                 "price": 100,  "type": "veg",     "spicy": 0, "cal": 130, "time": 2,  "url": "https://images.unsplash.com/photo-1527960471264-932f2fb4a2f5?w=800&q=80"},
            {"name": "Mountain Dew",          "price": 120,  "type": "veg",     "spicy": 0, "cal": 150, "time": 2,  "url": "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800&q=80"},
        ]
    },
    {
        "name": "Nepali Food",
        "slug": "nepali-food",
        "description": "Authentic and traditional Nepalese cuisine.",
        "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
        "items": [
            {"name": "Dal Bhat Set",          "price": 450,  "type": "veg",     "spicy": 1, "cal": 700, "time": 30, "url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80"},
            {"name": "Sel Roti",              "price": 150,  "type": "veg",     "spicy": 0, "cal": 280, "time": 15, "url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80"},
            {"name": "Chatamari",             "price": 250,  "type": "veg",     "spicy": 1, "cal": 320, "time": 20, "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"},
            {"name": "Thakali Khana",         "price": 600,  "type": "non_veg", "spicy": 2, "cal": 850, "time": 40, "url": "https://images.unsplash.com/photo-1631452180519-c014fe946cea?w=800&q=80"},
            {"name": "Chicken Sekuwa",        "price": 400,  "type": "non_veg", "spicy": 3, "cal": 480, "time": 35, "url": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80"},
        ]
    },
    {
        "name": "Indian Food",
        "slug": "indian-food",
        "description": "Rich and flavorful curries and breads.",
        "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=800&q=80",
        "items": [
            {"name": "Butter Chicken",        "price": 550,  "type": "non_veg", "spicy": 2, "cal": 680, "time": 30, "url": "https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=800&q=80"},
            {"name": "Paneer Butter Masala",  "price": 450,  "type": "veg",     "spicy": 2, "cal": 580, "time": 25, "url": "https://images.unsplash.com/photo-1631452180519-c014fe946cea?w=800&q=80"},
            {"name": "Garlic Naan",           "price": 120,  "type": "veg",     "spicy": 0, "cal": 280, "time": 15, "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"},
            {"name": "Chicken Tikka Masala",  "price": 600,  "type": "non_veg", "spicy": 3, "cal": 720, "time": 35, "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"},
            {"name": "Butter Naan",           "price": 100,  "type": "veg",     "spicy": 0, "cal": 260, "time": 15, "url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80"},
        ]
    },
    {
        "name": "Chinese Food",
        "slug": "chinese-food",
        "description": "Delicious noodles, stir-fries, and more.",
        "image_url": "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80",
        "items": [
            {"name": "Chow Mein",             "price": 250,  "type": "non_veg", "spicy": 2, "cal": 400, "time": 20, "url": "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80"},
            {"name": "Fried Rice",            "price": 280,  "type": "non_veg", "spicy": 1, "cal": 450, "time": 20, "url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"},
            {"name": "Manchurian",            "price": 350,  "type": "non_veg", "spicy": 3, "cal": 500, "time": 25, "url": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80"},
            {"name": "Hakka Noodles",         "price": 300,  "type": "non_veg", "spicy": 2, "cal": 420, "time": 20, "url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80"},
            {"name": "Hot Garlic Chicken",    "price": 450,  "type": "non_veg", "spicy": 4, "cal": 560, "time": 25, "url": "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80"},
        ]
    },
    {
        "name": "Desserts",
        "slug": "desserts",
        "description": "Sweet treats to end your meal on a high note.",
        "image_url": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        "items": [
            {"name": "Brownie",               "price": 300,  "type": "veg",     "spicy": 0, "cal": 380, "time": 10, "url": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80"},
            {"name": "Cheesecake",            "price": 450,  "type": "veg",     "spicy": 0, "cal": 420, "time": 10, "url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80"},
            {"name": "Donut",                 "price": 150,  "type": "veg",     "spicy": 0, "cal": 280, "time": 5,  "url": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80"},
            {"name": "Chocolate Mousse",      "price": 350,  "type": "veg",     "spicy": 0, "cal": 350, "time": 10, "url": "https://images.unsplash.com/photo-1511381939415-e440c9a590d6?w=800&q=80"},
            {"name": "Cupcake",               "price": 200,  "type": "veg",     "spicy": 0, "cal": 320, "time": 5,  "url": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80"},
        ]
    },
    {
        "name": "Snacks",
        "slug": "snacks",
        "description": "Quick bites for your cravings.",
        "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908582?w=800&q=80",
        "items": [
            {"name": "French Fries",          "price": 250,  "type": "veg",     "spicy": 0, "cal": 360, "time": 15, "url": "https://images.unsplash.com/photo-1576107232684-1279f3908582?w=800&q=80"},
            {"name": "Onion Rings",           "price": 300,  "type": "veg",     "spicy": 0, "cal": 300, "time": 15, "url": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80"},
            {"name": "Nachos",                "price": 350,  "type": "veg",     "spicy": 1, "cal": 380, "time": 10, "url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80"},
            {"name": "Popcorn Chicken",       "price": 400,  "type": "non_veg", "spicy": 2, "cal": 420, "time": 20, "url": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80"},
            {"name": "Garlic Bread",          "price": 280,  "type": "veg",     "spicy": 0, "cal": 320, "time": 10, "url": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=80"},
        ]
    },
    {
        "name": "Healthy Food",
        "slug": "healthy-food",
        "description": "Fresh and nutritious meals.",
        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        "items": [
            {"name": "Caesar Salad",          "price": 450,  "type": "veg",     "spicy": 0, "cal": 280, "time": 10, "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"},
            {"name": "Grilled Chicken Salad", "price": 550,  "type": "non_veg", "spicy": 0, "cal": 350, "time": 15, "url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"},
            {"name": "Fruit Bowl",            "price": 350,  "type": "veg",     "spicy": 0, "cal": 200, "time": 5,  "url": "https://images.unsplash.com/photo-1490474504059-1ed4e736a5ac?w=800&q=80"},
            {"name": "Smoothie Bowl",         "price": 400,  "type": "veg",     "spicy": 0, "cal": 280, "time": 10, "url": "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&q=80"},
            {"name": "Veg Salad",             "price": 300,  "type": "veg",     "spicy": 0, "cal": 180, "time": 5,  "url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"},
        ]
    }
]


def seed_categories_and_foods():
    print("Seeding categories and foods...")
    for cat_data in CATEGORIES:
        cat = Category.objects.create(
            name=cat_data["name"],
            slug=cat_data["slug"],
            description=cat_data["description"],
            image_url=cat_data["image_url"]
        )
        print(f"  Created category: {cat.name}")

        for item_data in cat_data["items"]:
            original_price = item_data["price"]
            discount = random.choice([0, 0, 10, 15, 20])
            price = int(original_price * (1 - discount / 100))

            FoodItem.objects.create(
                name=item_data["name"],
                category=cat,
                description=f"Delicious {item_data['name']} prepared with the finest ingredients. Authentic taste guaranteed.",
                price=Decimal(price),
                original_price=Decimal(original_price),
                discount=Decimal(discount),
                image_url=item_data["url"],
                preparation_time=item_data.get("time", 20),
                calories=item_data.get("cal", 400),
                food_type=item_data["type"],
                spicy_level=item_data.get("spicy", 0),
                is_available=True,
                is_popular=random.choice([True, False, False]),
                is_recommended=random.choice([True, False])
            )


def seed_heroes():
    print("Seeding heroes...")
    heroes = [
        {"title": "Spicy Delight",   "food": "Chicken Tikka Pizza",  "cat": "Pizza",   "price": 850,  "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80"},
        {"title": "Cheesy Goodness", "food": "Margherita Pizza",      "cat": "Pizza",   "price": 600,  "url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=80"},
        {"title": "Sweet Treats",    "food": "Chocolate Cake",        "cat": "Cake",    "price": 1200, "url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80"},
        {"title": "Healthy Bites",   "food": "Caesar Salad",          "cat": "Healthy", "price": 450,  "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80"},
        {"title": "Midnight Snacks", "food": "French Fries",          "cat": "Snacks",  "price": 250,  "url": "https://images.unsplash.com/photo-1576107232684-1279f3908582?w=1200&q=80"},
        {"title": "Morning Coffee",  "food": "Cappuccino",            "cat": "Coffee",  "price": 250,  "url": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=1200&q=80"},
        {"title": "Family Feast",    "food": "Chicken Biryani",       "cat": "Biryani", "price": 450,  "url": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=1200&q=80"},
        {"title": "Quick Bite",      "food": "Chicken Burger",        "cat": "Burgers", "price": 450,  "url": "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=1200&q=80"},
        {"title": "Vegan Special",   "food": "Veg Salad",             "cat": "Healthy", "price": 300,  "url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80"},
        {"title": "Meat Lovers",     "food": "Mutton Biryani",        "cat": "Biryani", "price": 650,  "url": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200&q=80"},
    ]
    for item in heroes:
        Hero.objects.create(
            title=item["title"],
            food_name=item["food"],
            category_name=item["cat"],
            price=Decimal(item["price"]),
            rating=Decimal(str(round(random.uniform(4.0, 5.0), 1))),
            is_best_seller=True,
            delivery_time=f"{random.randint(20, 40)} Min",
            image_url=item["url"]
        )


def seed_banners():
    print("Seeding offer banners...")
    banners = [
        {"title": "Weekend Special",  "subtitle": "Get amazing discounts this weekend", "code": "WEEKEND20", "discount_text": "20% OFF", "url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"},
        {"title": "Free Delivery",    "subtitle": "On all orders above Rs. 1000",       "code": "FREEDEL",   "discount_text": "FREE",    "url": "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1200&q=80"},
        {"title": "Combo Deal",       "subtitle": "Buy 2 Pizzas get 1 Free",            "code": "PIZZA3",    "discount_text": "B2G1",    "url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80"},
    ]
    for i, item in enumerate(banners):
        OfferBanner.objects.create(
            title=item["title"],
            subtitle=item["subtitle"],
            code=item["code"],
            discount_text=item["discount_text"],
            image_url=item["url"],
            is_active=True,
            order=i
        )


if __name__ == "__main__":
    clear_db()
    seed_categories_and_foods()
    seed_heroes()
    seed_banners()
    print("\nDatabase seeding completed successfully!")
