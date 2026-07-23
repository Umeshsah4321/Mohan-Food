from django.contrib import admin
from .models import Order, OrderItem, Coupon

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'delivery_option', 'payment_method', 'payment_status', 'grand_total', 'created_at')
    list_filter = ('status', 'delivery_option', 'payment_method', 'payment_status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'transaction_id', 'payment_id')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]

    fieldsets = (
        ('General', {
            'fields': ('user', 'status', 'created_at', 'updated_at')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax', 'delivery_charge', 'discount_amount', 'grand_total', 'coupon')
        }),
        ('Payment', {
            'fields': ('payment_method', 'payment_status', 'payment_id', 'transaction_id')
        }),
        ('Delivery Information', {
            'fields': ('delivery_option', 'delivery_time', 'province', 'district', 'city', 'area', 'street', 'shipping_address', 'delivery_instructions', 'latitude', 'longitude')
        }),
    )

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'valid_from', 'valid_to', 'active')
    list_filter = ('active', 'valid_from', 'valid_to')
