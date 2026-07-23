from django.urls import path
from .views import CategoryListView, FoodItemListView, FoodItemDetailView, ReviewCreateView, HeroListView, OfferBannerListView

urlpatterns = [
    path('hero/', HeroListView.as_view(), name='hero-list'),
    path('banners/', OfferBannerListView.as_view(), name='banner-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('foods/', FoodItemListView.as_view(), name='food-list'),
    path('foods/<int:pk>/', FoodItemDetailView.as_view(), name='food-detail'),
    path('foods/<int:pk>/reviews/', ReviewCreateView.as_view(), name='review-create'),
]
