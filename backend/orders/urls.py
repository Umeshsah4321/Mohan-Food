from django.urls import path
from .views import OrderListCreateView, OrderDetailView, VerifyPaymentView, LiveOrderTrackingView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('<int:pk>/live-tracking/', LiveOrderTrackingView.as_view(), name='live-tracking'),
]
