import os
import sys
import django
import urllib.request
from django.core.files.base import ContentFile
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from food.models import Category, FoodItem, Hero, OfferBanner

def download_image(url, filename):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
            return ContentFile(content, name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def main():
    print("Fixing missing food images...")
    counter = 1000
    for food in FoodItem.objects.all():
        if not food.image:
            print(f"  Fixing {food.name}...")
            slug = food.name.lower().replace(" ", "_")
            url = f"https://picsum.photos/seed/{counter}/800/600"
            img_file = download_image(url, f"food_{food.id}_{slug}.jpg")
            if img_file:
                food.image = img_file
                food.save()
            counter += 1
            time.sleep(0.5)

    print("Fixing missing category images...")
    for cat in Category.objects.all():
        if not cat.image:
            print(f"  Fixing {cat.name}...")
            url = f"https://picsum.photos/seed/{counter}/800/600"
            img_file = download_image(url, f"cat_{cat.slug}.jpg")
            if img_file:
                cat.image = img_file
                cat.save()
            counter += 1
            time.sleep(0.5)

    print("Fixing missing hero images...")
    for hero in Hero.objects.all():
        if not hero.image:
            print(f"  Fixing {hero.title}...")
            slug = hero.title.lower().replace(" ", "_")
            url = f"https://picsum.photos/seed/{counter}/800/600"
            img_file = download_image(url, f"hero_{hero.id}_{slug}.jpg")
            if img_file:
                hero.image = img_file
                hero.save()
            counter += 1
            time.sleep(0.5)
            
    print("Done!")

if __name__ == '__main__':
    main()
