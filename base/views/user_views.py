from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product
from django.contrib.auth.models import User
from base.serializer import UserSerializer,UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializers = UserSerializerWithToken(self.user).data

        for k,v in serializers.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializers = UserSerializerWithToken(user,many = False)
        return Response(serializers.data)
    except:
        message = {'detail':'User with this email already exists'}
        return Response(message, status = status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializers = UserSerializerWithToken(user,many = False)

    data = request.data

    user.first_name = data['name']
    user.user_name = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.passowrd = make_password(data['password'])

    user.save()

    return Response(serializers.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializers = UserSerializer(user,many = False)
    return Response(serializers.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializers = UserSerializer(users,many = True)
    return Response(serializers.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request,pk):
    user = User.objects.get(id = pk)
    serializers = UserSerializer(user,many = False)
    return Response(serializers.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request,pk):
    user = User.objects.get(id = pk)
    data = request.data
    print(data)
    user.first_name = data['name']
    user.user_name = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    user.save()
    serializers = UserSerializer(user,many = False)
    return Response(serializers.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request,pk):
    userForDeletion = User.objects.get(id = pk)
    userForDeletion.delete()
    return Response("User was Deleted")


