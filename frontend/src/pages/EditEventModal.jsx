import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import ProfileDropdown from '../components/ProfileDropdown';
import TimezoneDropDown from '../components/TimezoneDropdown';
import DatePicker from '../components/DatePicker';
import TimePickerCustom from '../components/TimePickerCustom';
import { useUpdateEvent } from '../hooks/event.hook';

const EditEventModal = ({ event, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState(event.users || []);
  const [timezone, setTimezone] = useState(event.timezone || 'Asia/Kolkata');

  const [startDate, setStartDate] = useState(dayjs(event.startDate));
  const [endDate, setEndDate] = useState(dayjs(event.endDate));
  const [startTime, setStartTime] = useState(dayjs(event.startTime, 'HH:mm'));
  const [endTime, setEndTime] = useState(dayjs(event.endTime, 'HH:mm'));

  const [openDropdown, setOpenDropdown] = useState(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const { mutate: updateEvent, status } = useUpdateEvent();

  const handleUpdateEvent = () => {
    if (!startDate || !endDate || !startTime || !endTime || selectedUsers.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      eventId: event._id,
      updates: {
        users: selectedUsers.map((u) => u._id),
        timezone,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        startTime: dayjs(startTime).format('HH:mm A'),
        endTime: dayjs(endTime).format('HH:mm A'),
      },
      clientUpdatedAt: new Date().toISOString(),
    };

    console.log('update payload -------------->', payload);

    updateEvent(payload, {
      onSuccess: () => {
        toast.success('Event updated successfully!');
        onClose();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to update event');
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      setTimeout(() => {
        if (startDateRef.current && !startDateRef.current.contains(e.target) && openDropdown === 'startDate')
          setOpenDropdown(null);
        if (endDateRef.current && !endDateRef.current.contains(e.target) && openDropdown === 'endDate')
          setOpenDropdown(null);
        if (startTimeRef.current && !startTimeRef.current.contains(e.target) && openDropdown === 'startTime')
          setOpenDropdown(null);
        if (endTimeRef.current && !endTimeRef.current.contains(e.target) && openDropdown === 'endTime')
          setOpenDropdown(null);
      }, 0);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-7/8 lg:w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={onClose}>
          <X className="size-5" />
        </button>

        <h2 className="font-semibold text-xl text-black mb-4">Edit Event</h2>

        <h3 className="font-medium text-sm mt-2">Profiles</h3>
        <ProfileDropdown selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />

        <h3 className="font-medium text-sm mt-4">Timezone</h3>
        <TimezoneDropDown selected={timezone} onSelect={setTimezone} />

        <h1 className="font-medium text-sm mt-4">Start Date & Time</h1>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-2">
          <div
            className="flex items-center w-3/4 bg-gray-200/70 hover:bg-purple-500/90 rounded-md h-10 mt-2 relative cursor-pointer"
            onClick={() => setOpenDropdown(openDropdown === 'startDate' ? null : 'startDate')}
            ref={startDateRef}
          >
            <Calendar className="ml-4 size-5 text-gray-400" />
            <p className="ml-4 text-sm text-gray-600 font-medium">
              {startDate ? dayjs(startDate).format('MMMM Do, YYYY') : 'Pick a date'}
            </p>

            {openDropdown === 'startDate' && (
              <DatePicker
                onDateChange={(date) => {
                  setStartDate(dayjs(date));
                  setOpenDropdown(null);
                }}
              />
            )}
          </div>

          <div className="flex items-center w-1/3 lg:w-1/4 bg-gray-200/70 rounded-md h-10 mt-2 relative">
            <div
              className="flex items-center justify-between w-full h-full px-3 cursor-pointer"
              onClick={() => setOpenDropdown(openDropdown === 'startTime' ? null : 'startTime')}
            >
              <p className="text-sm text-gray-600 font-medium">
                {startTime ? dayjs(startTime).format('hh:mm A') : 'Select time'}
              </p>
              <Clock size={18} className="text-gray-500" />
            </div>

            {openDropdown === 'startTime' && (
              <div ref={startTimeRef} className="absolute right-1 bottom-11 z-50">
                <TimePickerCustom
                  value={startTime}
                  onChange={(newValue) => {
                    setStartTime(dayjs(newValue));
                    setOpenDropdown(null);
                  }}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>
        </div>

        {/* End Date & Time */}
        <h1 className="font-medium text-sm mt-4">End Date & Time</h1>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-2">
          <div
            className="flex items-center w-3/4 bg-gray-200/70 hover:bg-purple-500/90 rounded-md h-10 mt-2 relative cursor-pointer"
            onClick={() => setOpenDropdown(openDropdown === 'endDate' ? null : 'endDate')}
            ref={endDateRef}
          >
            <Calendar className="ml-4 size-5 text-gray-400" />
            <p className="ml-4 text-sm text-gray-600 font-medium">
              {endDate ? dayjs(endDate).format('MMMM Do, YYYY') : 'Pick a date'}
            </p>

            {openDropdown === 'endDate' && (
              <DatePicker
                minDate={startDate ? startDate.toDate() : null}
                onDateChange={(date) => {
                  setEndDate(dayjs(date));
                  setOpenDropdown(null);
                }}
              />
            )}
          </div>

          <div className="flex items-center w-1/3 lg:w-1/4 bg-gray-200/70 rounded-md h-10 mt-2 relative">
            <div
              className="flex items-center justify-between w-full h-full px-3 cursor-pointer"
              onClick={() => setOpenDropdown(openDropdown === 'endTime' ? null : 'endTime')}
            >
              <p className="text-sm text-gray-600 font-medium">
                {endTime ? dayjs(endTime).format('hh:mm A') : 'Select time'}
              </p>
              <Clock size={18} className="text-gray-500" />
            </div>

            {openDropdown === 'endTime' && (
              <div ref={endTimeRef} className="absolute right-1 bottom-11 z-50">
                <TimePickerCustom
                  value={endTime}
                  onChange={(newValue) => {
                    setEndTime(dayjs(newValue));
                    setOpenDropdown(null);
                  }}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-3">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateEvent}
            disabled={status === 'loading'}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 ${
              status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {status === 'loading' ? <Loader2 className="animate-spin size-5" /> : 'Update Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
