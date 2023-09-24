from django.urls import path
from .views import TodoView

urlpatterns = [
    path('tasks/', TodoView.as_view(), name="todo-list-create"),
    path('tasks/<int:pk>/', TodoView.as_view(), name="todo-update-delete"),
]
