from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import requests
from django.conf import settings

class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_id = request.data.get('payment_id') # token for khalti
        transaction_id = request.data.get('transaction_id')
        payment_gateway = request.data.get('payment_gateway', 'khalti')
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            
            if order.payment_status:
                return Response({"message": "Order is already paid"}, status=status.HTTP_400_BAD_REQUEST)

            if payment_gateway == 'khalti':
                # amount in paisa
                payload = {
                    "token": payment_id,
                    "amount": int(order.grand_total * 100)
                }
                headers = {
                    "Authorization": f"Key {settings.KHALTI_SECRET_KEY}"
                }
                response = requests.post("https://khalti.com/api/v2/payment/verify/", payload, headers=headers)
                
                if response.status_code == 200:
                    order.payment_status = True
                    order.payment_id = payment_id
                    order.transaction_id = response.json().get('idx', transaction_id)
                    order.save()
                    return Response({"message": "Khalti Payment verified successfully", "order_id": order.id})
                else:
                    return Response({"error": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

            elif payment_gateway == 'esewa':
                # Add eSewa verification logic here
                # Mocking eSewa for now
                order.payment_status = True
                order.payment_id = payment_id
                order.transaction_id = transaction_id
                order.save()
                return Response({"message": "eSewa Payment verified successfully", "order_id": order.id})
            
            return Response({"error": "Invalid payment gateway"}, status=status.HTTP_400_BAD_REQUEST)
            
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

import random

class LiveOrderTrackingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
            
            # Mock rider location around Imadol, Lalitpur
            # Imadol center approx: 27.662, 85.337
            base_lat, base_lng = 27.662, 85.337
            rider_lat = base_lat + random.uniform(-0.01, 0.01)
            rider_lng = base_lng + random.uniform(-0.01, 0.01)
            
            return Response({
                "order_id": order.id,
                "status": order.status,
                "payment_status": order.payment_status,
                "rider_location": {
                    "lat": rider_lat,
                    "lng": rider_lng
                },
                "restaurant_location": {
                    "lat": 27.662194, 
                    "lng": 85.336449
                }
            })
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
