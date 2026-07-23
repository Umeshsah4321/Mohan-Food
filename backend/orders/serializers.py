from rest_framework import serializers
from .models import Order, OrderItem, Coupon
from food.serializers import FoodItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    food_detail = FoodItemSerializer(source='food', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'food', 'food_detail', 'quantity', 'price')
        read_only_fields = ('price',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'status', 'payment_status', 'subtotal', 'grand_total', 'tax', 'discount_amount')

    def create(self, validated_data):
        from django.db import transaction
        
        with transaction.atomic():
            items_data = validated_data.pop('items')
            user = self.context['request'].user
            
            # Calculate totals
            subtotal = sum([item['food'].price * item['quantity'] for item in items_data])
            tax = float(subtotal) * 0.13 # 13% tax example
            
            coupon = validated_data.get('coupon')
            discount_amount = 0
            if coupon and coupon.active:
                discount_amount = float(subtotal) * (float(coupon.discount_percentage) / 100)

            grand_total = float(subtotal) + tax + float(validated_data.get('delivery_charge', 0)) - discount_amount

            order = Order.objects.create(
                user=user,
                subtotal=subtotal,
                tax=tax,
                discount_amount=discount_amount,
                grand_total=grand_total,
                **validated_data
            )

            for item_data in items_data:
                OrderItem.objects.create(
                    order=order,
                    food=item_data['food'],
                    quantity=item_data['quantity'],
                    price=item_data['food'].price
                )

            return order
