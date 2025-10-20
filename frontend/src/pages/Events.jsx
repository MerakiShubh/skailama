import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import TimezoneDropDown from '../components/TimezoneDropdown';
import { Calendar, Clock, FileText, SquarePen, Users, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetAllEvents } from '../hooks/event.hook';
import EditEventModal from './EditEventModal';
import EventLogsModal from './EventLogsModal';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const Events = () => {
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [editingEvent, setEditingEvent] = useState(null);

  const { data, isLoading, isError } = useGetAllEvents(selectedUser?._id, {
    enabled: !!selectedUser?._id,
  });

  const [showLogs, setShowLogs] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleViewLogs = (id) => {
    setSelectedEventId(id);
    setShowLogs(true);
  };

  const convertDateTimeToTimezone = (date, time, fromZone, toZone) => {
    if (!date || !time) return { newDate: date, newTime: time };

    const combined = dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', fromZone).tz(toZone);

    return {
      newDate: combined.format('MMM DD, YYYY'),
      newTime: combined.format('hh:mm A'),
      dateObj: combined.toDate(),
    };
  };

  return (
    <div className="w-full h-full lg:w-1/2 bg-white rounded-lg shadow-2xl flex-1">
      <div className="p-6 h-full">
        <h2 className="font-medium text-xl text-black">Events</h2>
        <h3 className="font-medium text-sm mt-4">View in Timezone</h3>
        <TimezoneDropDown selected={timezone} onSelect={setTimezone} />

        <div className="mt-8 h-2/3 w-full rounded-md shadow-lg  border border-gray-200 overflow-y-auto">
          {!selectedUser?._id ? (
            <div className="text-sm text-gray-500 p-4 text-center">No events</div>
          ) : isLoading ? (
            <div className="w-full flex justify-center items-center p-10">
              <Loader2 className="animate-spin size-6 text-gray-500" />
            </div>
          ) : isError ? (
            <div className="text-red-500 text-center p-4">Failed to load events</div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-sm text-gray-500 p-4 text-center">No events found for this user</div>
          ) : (
            data.data.map((event) => {
              const { newDate: startDateFormatted, newTime: startTimeFormatted } = convertDateTimeToTimezone(
                event.startDate,
                event.startTime,
                event.timezone,
                timezone
              );
              const { newDate: endDateFormatted, newTime: endTimeFormatted } = convertDateTimeToTimezone(
                event.endDate,
                event.endTime,
                event.timezone,
                timezone
              );

              return (
                <div key={event._id} className="p-4 mb-4 border border-gray-200 rounded-md shadow-sm">
                  <div className="flex items-center justify-start">
                    <Users className="size-4 text-purple-500 text-base font-semibold" />
                    <p className="text-sm text-black font-semibold ml-3">{event.users.map((u) => u.name).join(', ')}</p>
                  </div>

                  <div className="mt-4 flex items-center">
                    <Calendar className="size-4 text-gray-400" />
                    <div className="flex flex-col justify-center ml-3 gap-1">
                      <p className="text-sm font-medium">
                        Start: <span className="text-black text-sm font-semibold ml-1">{startDateFormatted}</span>
                      </p>
                      <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        <Clock className="size-4 text-gray-400" /> <span>{startTimeFormatted}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    <Calendar className="size-4 text-gray-400" />
                    <div className="flex flex-col justify-center ml-3 gap-1">
                      <p className="text-sm font-medium">
                        End: <span className="text-black text-sm font-semibold ml-1">{endDateFormatted}</span>
                      </p>
                      <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        <Clock className="size-4 text-gray-400" /> <span>{endTimeFormatted}</span>
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200/85 shadow-xl mt-5 w-full" />

                  <div className="mt-4 flex flex-col gap-1">
                    <p className="text-gray-400 text-sm font-semibold">
                      Created: {dayjs(event.createdAt).format('MMM DD [at] hh:mm A')}
                    </p>
                    <p className="text-gray-400 text-sm font-semibold">
                      Updated: {dayjs(event.updatedAt).format('MMM DD [at] hh:mm A')}
                    </p>
                  </div>

                  <div className="border border-gray-200/85 shadow-xl mt-3 w-full" />

                  <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-4 mt-4">
                    <button
                      className="flex items-center justify-center gap-2 w-full lg:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors duration-200"
                      onClick={() => setEditingEvent(event)}
                    >
                      <SquarePen className="size-4 text-gray-800" />
                      Edit
                    </button>
                    {editingEvent && <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} />}

                    <button
                      className="flex items-center justify-center gap-2 w-full lg:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors duration-200"
                      onClick={() => handleViewLogs(event._id)}
                    >
                      <FileText className="size-4 text-gray-800" />
                      View Logs
                    </button>
                    {showLogs && <EventLogsModal eventId={selectedEventId} onClose={() => setShowLogs(false)} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
