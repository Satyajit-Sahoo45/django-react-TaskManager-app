from .views import TodoView
from django.urls import path                   

My_TodoView = TodoView.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    path('tasks/', My_TodoView, name="todo"),
]