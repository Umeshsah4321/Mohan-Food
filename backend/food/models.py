from django.db import models
from django.conf import settings
from core.validators import validate_file_size, validate_image_extension

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True, help_text="Category description for the frontend.")
    image = models.ImageField(upload_to='categories/', blank=True, null=True, validators=[validate_file_size, validate_image_extension])
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback if no uploaded image)")
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Hero(models.Model):
    title = models.CharField(max_length=200)
    food_name = models.CharField(max_length=200)
    category_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    is_best_seller = models.BooleanField(default=True)
    delivery_time = models.CharField(max_length=50, default='20-30 Min')
    image = models.ImageField(upload_to='hero/', blank=True, null=True, validators=[validate_file_size, validate_image_extension])
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback if no uploaded image)")

    def __str__(self):
        return self.title

class FoodItem(models.Model):
    VEG = 'veg'
    NON_VEG = 'non_veg'
    FOOD_TYPE_CHOICES = [
        (VEG, 'Vegetarian'),
        (NON_VEG, 'Non-Vegetarian')
    ]

    SPICY_LEVELS = [
        (0, 'Not Spicy'),
        (1, 'Mild'),
        (2, 'Medium'),
        (3, 'Hot'),
        (4, 'Extra Hot')
    ]

    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='foods')
    description = models.TextField()
    ingredients = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.0) # percentage
    image = models.ImageField(upload_to='foods/', blank=True, null=True, validators=[validate_file_size, validate_image_extension])
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback if no uploaded image)")
    preparation_time = models.IntegerField(help_text="Preparation time in minutes", default=15)
    calories = models.IntegerField(blank=True, null=True)
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES, default=VEG)
    spicy_level = models.IntegerField(choices=SPICY_LEVELS, default=0)
    is_available = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    image = models.ImageField(upload_to='reviews/', blank=True, null=True, validators=[validate_file_size, validate_image_extension])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.food} ({self.rating})"

class OfferBanner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    code = models.CharField(max_length=50, blank=True)
    discount_text = models.CharField(max_length=100)
    image = models.ImageField(upload_to='banners/', blank=True, null=True, validators=[validate_file_size, validate_image_extension])
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL (fallback if no uploaded image)")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-id']
        
    def __str__(self):
        return self.title
