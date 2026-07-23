const BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : "http://localhost:8000";

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";

/** Best image for a food item: Django media */
export function getFoodImage(food) {
  if (food?.resolved_image) {
    return food.resolved_image.startsWith('http') ? food.resolved_image : `${BASE}${food.resolved_image}`;
  }
  if (food?.image) {
    return food.image.startsWith('http') ? food.image : `${BASE}${food.image}`;
  }
  if (food?.image_url) return food.image_url;
  return DEFAULT_FALLBACK;
}

/** Best image for a category */
export function getCategoryImage(cat) {
  if (cat?.resolved_image) {
    return cat.resolved_image.startsWith('http') ? cat.resolved_image : `${BASE}${cat.resolved_image}`;
  }
  if (cat?.image) {
    return cat.image.startsWith('http') ? cat.image : `${BASE}${cat.image}`;
  }
  if (cat?.image_url) return cat.image_url;
  return DEFAULT_FALLBACK;
}

/** Best image for a hero slide */
export function getHeroImage(hero) {
  if (hero?.resolved_image) {
    return hero.resolved_image.startsWith('http') ? hero.resolved_image : `${BASE}${hero.resolved_image}`;
  }
  if (hero?.image) {
    return hero.image.startsWith('http') ? hero.image : `${BASE}${hero.image}`;
  }
  if (hero?.image_url) return hero.image_url;
  return DEFAULT_FALLBACK;
}

export function getBannerImage(banner) {
  if (banner?.resolved_image) {
    return banner.resolved_image.startsWith('http') ? banner.resolved_image : `${BASE}${banner.resolved_image}`;
  }
  if (banner?.image) {
    return banner.image.startsWith('http') ? banner.image : `${BASE}${banner.image}`;
  }
  if (banner?.image_url) return banner.image_url;
  return DEFAULT_FALLBACK;
}

export { DEFAULT_FALLBACK as FOOD_FALLBACK, DEFAULT_FALLBACK as CAT_FALLBACK, DEFAULT_FALLBACK as HERO_FALLBACK };
