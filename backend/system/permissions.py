from rest_framework import permissions

from system.models import User


class IsActivated(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_active


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.Roles.ADMIN


class IsAdminOrFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY)


class IsOwnerOrAdminOrFaculty(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            return True
        return obj.user == request.user
