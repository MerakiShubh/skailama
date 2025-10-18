import React, { useEffect, useState } from 'react';
import TimezoneDropDown from '../components/TimezoneDropdown';
import { Calendar, Clock, FileText, SquarePen, Users } from 'lucide-react';

const Events = () => {
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  function convertDateTimeToTimezone(date, time, fromZone, toZone) {
    if (!date || !time) return { newDate: date, newTime: time };

    const combined = dayjs.tz(`${dayjs(date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm', fromZone).tz(toZone);

    console.log('data ----------------->', {
      newDate: combined.toDate(),
      newTime: combined.format('HH:mm'),
    });

    return {
      // newDate: combined.toDate(),
      newDate: combined,
      newTime: combined,
    };
  }

  useEffect(() => {
    if (!timezone) return;

    if (startDate && startTime) {
      const { newDate, newTime } = convertDateTimeToTimezone(startDate, startTime, dayjs.tz.guess(), timezone);
      setStartDate(newDate);
      setStartTime(newTime);
    }

    if (endDate && endTime) {
      const { newDate, newTime } = convertDateTimeToTimezone(endDate, endTime, dayjs.tz.guess(), timezone);
      setEndDate(newDate);
      setEndTime(newTime);
    }
  }, [timezone]);
  return (
    <div className="w-full lg:w-1/2 h-full  bg-white rounded-lg shadow-2xl">
      <div className="p-6 h-full">
        <h2 className="font-medium text-xl text-black"> Events</h2>
        <h3 className="font-medium text-sm mt-4">View in Timezone</h3>
        <TimezoneDropDown selected={timezone} onSelect={setTimezone} />

        <div className="mt-8 h-2/3 w-full rounded-md shadow-lg border border-gray-200">
          <div className="p-4 h-full">
            {/* event details  */}
            <div className="h-2/3">
              <div className="flex items-center justify-start">
                <Users className="size-4 text-purple-500 text-base font-semibold" />
                <p className="text-sm text-black font-semibold ml-3">user1, user2</p>
              </div>
              <div className="mt-4 flex items-center">
                <div>
                  <Calendar className="size-4 text-gray-400" />
                </div>
                <div className="flex flex-col justify-center ml-3 gap-1">
                  <p className="text-sm font-medium">
                    Start: <span className="text-black text-sm font-semibold ml-1">Oct 14, 2025</span>{' '}
                  </p>
                  <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    {' '}
                    <Clock className="size-4 text-gray-400" /> <span> 11:30 PM</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div>
                  <Calendar className="size-4 text-gray-400" />
                </div>
                <div className="flex flex-col justify-center ml-3 gap-1">
                  <p className="text-sm font-medium">
                    End: <span className="text-black text-sm font-semibold ml-1">Oct 14, 2025</span>{' '}
                  </p>
                  <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    {' '}
                    <Clock className="size-4 text-gray-400" /> <span> 11:30 PM</span>
                  </p>
                </div>
              </div>

              {/* decorative element  */}
              <div className="border border-gray-200/85 shadow-xl mt-5 w-full" />

              <div className="mt-4 flex flex-col gap-1">
                <p className="text-gray-400 text-sm font-semibold">Created: Oct 11 at 03:56 PM</p>
                <p className="text-gray-400 text-sm font-semibold">Updated: Oct 11 at 03:56 PM</p>
              </div>

              <div className="border border-gray-200/85  shadow-xl mt-3 w-full" />
            </div>

            {/* edit and log  */}
            <div className="h-1/3">
              <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-4 mt-12">
                <button className="flex items-center justify-center gap-2 w-full lg:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors duration-200">
                  <SquarePen className="size-4 text-gray-800" />
                  Edit
                </button>

                <button className="flex items-center justify-center gap-2 w-full lg:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors duration-200">
                  <FileText className="size-4 text-gray-800" />
                  View Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
