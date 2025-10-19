import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser, getAllUsers, getUserById } from '../api/user.api';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(data?.message || 'User created successfully');

      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    },
  });
};

export const useGetUserById = (userId, enabled = true) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled, // Only runs when userId is available
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch user');
    },
  });
};
