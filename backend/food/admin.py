from django.contrib import admin
from django.utils.html import mark_safe
from .models import Category, FoodItem, Review, Hero, OfferBanner

def get_image_preview(obj):
    if obj.image:
        return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
    if obj.image_url:
        return mark_safe(f'<img src="{obj.image_url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
    return "-"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'image_preview')
    prepopulated_fields = {'slug': ('name',)}
    
    def image_preview(self, obj):
        return get_image_preview(obj)
    image_preview.short_description = 'Image'

@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_available', 'is_popular', 'image_preview')
    list_filter = ('category', 'is_available', 'is_popular', 'food_type')
    search_fields = ('name', 'description')
    
    def image_preview(self, obj):
        return get_image_preview(obj)
    image_preview.short_description = 'Image'

@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('title', 'food_name', 'price', 'rating', 'image_preview')
    
    def image_preview(self, obj):
        return get_image_preview(obj)
    image_preview.short_description = 'Image'

@admin.register(OfferBanner)
class OfferBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'discount_text', 'code', 'is_active', 'order', 'image_preview')
    list_editable = ('is_active', 'order')
    
    def image_preview(self, obj):
        return get_image_preview(obj)
    image_preview.short_description = 'Image'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'food', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
