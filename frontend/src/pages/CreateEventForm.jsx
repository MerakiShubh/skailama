import React, { useEffect, useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown";
import TimezoneDropDown from "../components/TimezoneDropdown";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TimePickerCustom from "../components/TimePickerCustom";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateEventForm = () => {
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  function convertDateTimeToTimezone(date, time, fromZone, toZone) {
    if (!date || !time) return { newDate: date, newTime: time };

    const combined = dayjs
      .tz(
        `${dayjs(date).format("YYYY-MM-DD")} ${time}`,
        "YYYY-MM-DD HH:mm",
        fromZone
      )
      .tz(toZone);

    console.log("data ----------------->", {
      newDate: combined.toDate(),
      newTime: combined.format("HH:mm"),
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
      const { newDate, newTime } = convertDateTimeToTimezone(
        startDate,
        startTime,
        dayjs.tz.guess(),
        timezone
      );
      setStartDate(newDate);
      setStartTime(newTime);
    }

    if (endDate && endTime) {
      const { newDate, newTime } = convertDateTimeToTimezone(
        endDate,
        endTime,
        dayjs.tz.guess(),
        timezone
      );
      setEndDate(newDate);
      setEndTime(newTime);
    }
  }, [timezone]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (
          startDateRef.current &&
          !startDateRef.current.contains(event.target)
        ) {
          setIsStartDatePickerOpen(false);
        }
        if (endDateRef.current && !endDateRef.current.contains(event.target)) {
          setIsEndDatePickerOpen(false);
        }

        if (
          startTimeRef.current &&
          !startTimeRef.current.contains(event.target)
        ) {
          setIsStartTimePickerOpen(false);
        }

        if (endTimeRef.current && !endTimeRef.current.contains(event.target)) {
          setIsEndTimePickerOpen(false);
        }
      }, 0);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (endDate && startDate && endDate < startDate) {
      setEndDate(null);
    }
  }, [startDate]);

  return (
    <div className="w-full lg:w-1/2 h-1/2 md:h-full bg-white rounded-lg shadow-2xl">
      <div className="p-6">
        <h2 className="font-medium text-xl text-black">Create Events</h2>

        <div className="mt-4">
          <h3 className="font-medium text-sm">Profiles</h3>
          <ProfileDropdown />

          <h3 className="font-medium text-sm mt-4">Timezone</h3>
          <TimezoneDropDown selected={timezone} onSelect={setTimezone} />
        </div>

        <h1 className="font-medium text-sm mt-4">Start Date & Time</h1>
        <div className="w-full flex justify-center items-center gap-2">
          <div
            className="flex items-center w-3/4 bg-gray-200/70 rounded-md h-10 mt-2 relative cursor-pointer"
            onClick={() => {
              setIsStartDatePickerOpen((prev) => !prev);
              setIsStartTimePickerOpen(false);
            }}
            ref={startDateRef}
          >
            <Calendar className="ml-4 size-5 text-gray-400" />
            <p className="ml-4 text-sm text-gray-600 font-medium">
              {startDate
                ? dayjs(startDate).tz(timezone).format("YYYY-MM-DD")
                : "Pick a date"}
            </p>

            {isStartDatePickerOpen && (
              <DatePicker
                onDateChange={(date) => {
                  // setStartDate(date);
                  setStartDate(dayjs(date));
                  setIsStartDatePickerOpen(false);
                }}
              />
            )}
          </div>

          <div className="flex items-center w-1/4 bg-gray-200/70 rounded-md h-10 mt-2 relative">
            <div
              className="flex items-center justify-between w-full h-full px-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsStartTimePickerOpen((prev) => !prev);
                setIsStartDatePickerOpen(false);
              }}
            >
              <p className="text-sm text-gray-600 font-medium">
                {startTime ? dayjs(startTime).format("hh:mm A") : "Select time"}
              </p>
              <Clock size={18} className="text-gray-500" />
            </div>

            {isStartTimePickerOpen && (
              <div
                ref={startTimeRef}
                className="absolute top-11 right-1 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <TimePickerCustom
                  value={startTime}
                  onChange={(newValue) => {
                    setStartTime(dayjs(newValue));
                    setIsStartDatePickerOpen(false);
                  }}
                  onClose={() => setIsStartTimePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="font-medium text-sm mt-4">End Date & Time</h1>
        <div className="w-full flex justify-center items-center gap-2">
          <div
            className="flex items-center w-3/4 bg-gray-200/70 rounded-md h-10 mt-2 relative cursor-pointer"
            onClick={() => {
              setIsEndDatePickerOpen((prev) => !prev);
              setIsEndTimePickerOpen(false);
            }}
            ref={endDateRef}
          >
            <Calendar className="ml-4 size-5 text-gray-400" />
            <p className="ml-4 text-sm text-gray-600 font-medium">
              {endDate
                ? dayjs(endDate).tz(timezone).format("YYYY-MM-DD")
                : "Pick a date"}
              {/* {endDate ? endDate.toDateString() : "Pick a date"} */}
            </p>

            {isEndDatePickerOpen && (
              <DatePicker
                onDateChange={(date) => {
                  // setEndDate(date);
                  setEndDate(dayjs(date));
                  setIsEndDatePickerOpen(false);
                }}
                minDate={startDate}
              />
            )}
          </div>

          <div className="flex items-center w-1/4 bg-gray-200/70 rounded-md h-10 mt-2 relative">
            <div
              className="flex items-center justify-between w-full h-full px-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsEndTimePickerOpen((prev) => !prev);
                setIsEndDatePickerOpen(false);
              }}
            >
              <p className="text-sm text-gray-600 font-medium">
                {endTime ? dayjs(endTime).format("hh:mm A") : "Select time"}
              </p>
              <Clock size={18} className="text-gray-500" />
            </div>

            {isEndTimePickerOpen && (
              <div
                ref={endTimeRef}
                className="absolute top-11 right-1 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <TimePickerCustom
                  value={endTime}
                  onChange={(newValue) => {
                    setEndTime(dayjs(newValue));
                    setIsEndDatePickerOpen(false);
                  }}
                  onClose={() => setIsEndTimePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
