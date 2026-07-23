from rest_framework import generics, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, FoodItem, Review, Hero, OfferBanner
from .serializers import CategorySerializer, FoodItemSerializer, ReviewSerializer, HeroSerializer, OfferBannerSerializer

class HeroListView(generics.ListAPIView):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer

class OfferBannerListView(generics.ListAPIView):
    queryset = OfferBanner.objects.filter(is_active=True)
    serializer_class = OfferBannerSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FoodItemListView(generics.ListAPIView):
    queryset = FoodItem.objects.filter(is_available=True)
    serializer_class = FoodItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'food_type', 'is_popular', 'is_recommended']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

class FoodItemDetailView(generics.RetrieveAPIView):
    queryset = FoodItem.objects.filter(is_available=True)
    serializer_class = FoodItemSerializer

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        food_id = self.kwargs.get('pk')
        food = FoodItem.objects.get(pk=food_id)
        serializer.save(user=self.request.user, food=food)
