import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createEvent, getAllEvents, updateEvent, getEventLogs } from '../api/event.api';

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      toast.success(data?.message || 'Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });
};

export const useGetAllEvents = (userId) =>
  useQuery({
    queryKey: ['events', userId],
    queryFn: () => getAllEvents(userId),
    enabled: !!userId,
  });

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (data) => {
      toast.success(data?.message || 'Event updated successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['eventLogs', data?.data?.updatedEvent?._id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });
};

export const useGetEventLogs = (eventId) =>
  useQuery({
    queryKey: ['eventLogs', eventId],
    queryFn: () => getEventLogs(eventId),
    enabled: !!eventId,
  });
