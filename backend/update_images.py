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
    if not url:
        return None
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
            return ContentFile(content, name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def main():
    print("Downloading category images...")
    for cat in Category.objects.all():
        if cat.image_url and not cat.image:
            print(f"  {cat.name}...")
            img_file = download_image(cat.image_url, f"cat_{cat.slug}.jpg")
            if img_file:
                cat.image = img_file
                cat.save()
            time.sleep(0.1)

    print("Downloading food images...")
    for food in FoodItem.objects.all():
        if food.image_url and not food.image:
            print(f"  {food.name}...")
            slug = food.name.lower().replace(" ", "_")
            img_file = download_image(food.image_url, f"food_{food.id}_{slug}.jpg")
            if img_file:
                food.image = img_file
                food.save()
            time.sleep(0.1)

    print("Downloading hero images...")
    for hero in Hero.objects.all():
        if hero.image_url and not hero.image:
            print(f"  {hero.title}...")
            slug = hero.title.lower().replace(" ", "_")
            img_file = download_image(hero.image_url, f"hero_{hero.id}_{slug}.jpg")
            if img_file:
                hero.image = img_file
                hero.save()
            time.sleep(0.1)

    print("Downloading banner images...")
    for banner in OfferBanner.objects.all():
        if banner.image_url and not banner.image:
            print(f"  {banner.title}...")
            slug = banner.title.lower().replace(" ", "_")
            img_file = download_image(banner.image_url, f"banner_{banner.id}_{slug}.jpg")
            if img_file:
                banner.image = img_file
                banner.save()
            time.sleep(0.1)
            
    print("Done!")

if __name__ == '__main__':
    main()
