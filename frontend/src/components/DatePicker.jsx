import React, { useState } from 'react';

const DatePicker = ({ onDateChange, minDate }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // const handleDateClick = (day) => {
  //   const newDate = new Date(currentYear, currentMonth, day);
  //   // Block clicks before minDate
  //   if (minDate && newDate < new Date(minDate.setHours(0, 0, 0, 0))) return;
  //   setSelectedDate(newDate);
  //   onDateChange?.(newDate);
  // };
  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);

    if (minDate) {
      // Convert Day.js -> Date if needed
      const minDateObj = minDate.$d ? minDate.toDate() : minDate;
      const normalizedMin = new Date(minDateObj);
      normalizedMin.setHours(0, 0, 0, 0);

      // Prevent selecting dates before minDate
      if (newDate < normalizedMin) return;
    }

    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // const isDateDisabled = (day) => {
  //   if (!minDate) return false;
  //   const date = new Date(currentYear, currentMonth, day);
  //   return date < new Date(minDate.setHours(0, 0, 0, 0));
  // };

  const isDateDisabled = (day) => {
    if (!minDate) return false;

    const date = new Date(currentYear, currentMonth, day);

    // Convert Day.js -> Date if needed
    const minDateObj = minDate.$d ? minDate.toDate() : minDate;
    const normalizedMin = new Date(minDateObj);
    normalizedMin.setHours(0, 0, 0, 0);

    return date < normalizedMin;
  };

  return (
    <div
      className="w-full max-w-60 md:max-w-68 h-66 p-4 bg-white border border-gray-200 rounded-lg shadow-sm absolute left-0 bottom-11  animate-fadeIn z-50"
      // onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="text-gray-600 hover:text-purple-500">
          &lt;
        </button>
        <h2 className="text-sm font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={handleNextMonth} className="text-gray-600 hover:text-purple-500">
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 uppercase mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center gap-1">
        {days.map((day, index) => {
          if (!day)
            return (
              <div key={index} className="opacity-0">
                -
              </div>
            );

          const isDisabled = isDateDisabled(day);
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          return (
            <div
              key={index}
              className={`py-2 rounded-lg text-xs transition-all duration-150
                ${
                  isDisabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : isSelected
                    ? 'bg-purple-500 text-white font-semibold'
                    : 'text-gray-700 hover:bg-blue-50 cursor-pointer'
                }
              `}
              onClick={() => !isDisabled && handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
