import os
import sys
import django

sys.path.append('c:\\Users\\Asus\\Desktop\\MaFood\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from food.models import FoodItem

all_foods = FoodItem.objects.all()
popular_foods = FoodItem.objects.filter(is_popular=True)

print(f"Total foods: {all_foods.count()}")
print(f"Popular foods: {popular_foods.count()}")
