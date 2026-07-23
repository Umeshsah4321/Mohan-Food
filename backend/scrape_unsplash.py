import urllib.request
import json
import re

queries = [
    "pizza", "burger", "momo dumpling", "biryani", "fried chicken",
    "pasta", "sandwich", "chicken roll", "cake", "ice cream",
    "coffee", "soft drink", "nepalese food", "indian curry", "chinese food",
    "dessert", "snacks", "healthy salad"
]

results = {}

for q in queries:
    try:
        url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(q)}&per_page=10"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req).read()
        data = json.loads(response)
        ids = [img['id'] for img in data['results']]
        results[q] = ids
    except Exception as e:
        print(f"Failed for {q}: {e}")

print(json.dumps(results))
