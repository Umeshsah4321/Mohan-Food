from rest_framework import serializers
from .models import Category, FoodItem, Review, Hero, OfferBanner

class HeroSerializer(serializers.ModelSerializer):
    resolved_image = serializers.SerializerMethodField()
    class Meta:
        model = Hero
        fields = '__all__'

    def get_resolved_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or None


class CategorySerializer(serializers.ModelSerializer):
    food_count = serializers.SerializerMethodField()
    starting_price = serializers.SerializerMethodField()
    resolved_image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_resolved_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or None

    def get_food_count(self, obj):
        return obj.foods.count()

    def get_starting_price(self, obj):
        min_food = obj.foods.order_by('price').first()
        return min_food.price if min_food else 0

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user',)

class FoodItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    resolved_image = serializers.SerializerMethodField()

    class Meta:
        model = FoodItem
        fields = '__all__'

    def get_resolved_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.count()

class OfferBannerSerializer(serializers.ModelSerializer):
    resolved_image = serializers.SerializerMethodField()

    class Meta:
        model = OfferBanner
        fields = '__all__'

    def get_resolved_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or None
