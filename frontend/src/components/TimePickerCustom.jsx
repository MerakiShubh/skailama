import React, { useEffect, useRef, useState } from "react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const itemHeight = 36;

const TimePickerCustom = ({
  value = new Date(),
  onChange,
  hourStep = 1,
  minuteStep = 1,
  className = "",
  onClose,
}) => {
  const setRef = useRef(null);

  const normalizeToDate = (val) => {
    try {
      if (!val) return new Date();

      if (val?.$d instanceof Date) return val.$d;

      if (val instanceof Date && !isNaN(val)) return val;

      if (typeof val === "string" || typeof val === "number") {
        const d = new Date(val);
        if (!isNaN(d)) return d;
      }
    } catch (err) {
      console.warn("Invalid time value received:", val, err);
    }
    return new Date();
  };

  const to12Hour = (dateObj) => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
      console.warn("Invalid date passed to to12Hour:", dateObj);
      dateObj = new Date();
    }

    const h = dateObj.getHours();
    const isAM = h < 12;
    const hour12 = ((h + 11) % 12) + 1;
    return {
      hour: hour12,
      minute: dateObj.getMinutes(),
      meridiem: isAM ? "AM" : "PM",
    };
  };

  const date = normalizeToDate(value);

  const {
    hour: initialHour,
    minute: initialMinute,
    meridiem: initialMeridiem,
  } = to12Hour(date);

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(
    Math.round(initialMinute / minuteStep) * minuteStep
  );
  const [meridiem, setMeridiem] = useState(initialMeridiem);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const meridiemRef = useRef(null);

  useEffect(() => {
    const {
      hour: h,
      minute: m,
      meridiem: mm,
    } = to12Hour(normalizeToDate(value));
    setHour(h);
    setMinute(Math.round(m / minuteStep) * minuteStep);
    setMeridiem(mm);
  }, [value, minuteStep]);

  const buildDateFromSelection = (selHour, selMinute, selMeridiem) => {
    const out = normalizeToDate(value);
    let h = selHour % 12;
    if (selMeridiem === "PM") h += 12;
    out.setHours(h, selMinute, 0, 0);
    return out;
  };

  const scrollToSelected = (ref, index) => {
    if (!ref?.current) return;
    const container = ref.current;
    const top =
      index * itemHeight - container.clientHeight / 2 + itemHeight / 2;
    container.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => scrollToSelected(hourRef, HOURS.indexOf(hour)), [hour]);
  useEffect(
    () => scrollToSelected(minuteRef, Math.round(minute / minuteStep)),
    [minute, minuteStep]
  );
  useEffect(
    () => scrollToSelected(meridiemRef, meridiem === "AM" ? 0 : 1),
    [meridiem]
  );

  const handleKey = (whichColumn, e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const dir = e.key === "ArrowUp" ? -1 : 1;
      if (whichColumn === "hour") {
        let idx = HOURS.indexOf(hour);
        idx = (idx + dir + HOURS.length) % HOURS.length;
        setHour(HOURS[idx]);
      } else if (whichColumn === "minute") {
        let idx = Math.round(minute / minuteStep);
        const steps = Math.round(60 / minuteStep);
        idx = (idx + dir + steps) % steps;
        setMinute(MINUTES[idx * minuteStep]);
      } else {
        setMeridiem((m) => (m === "AM" ? "PM" : "AM"));
      }
    }
  };

  const formatMin = (m) => (m < 10 ? `0${m}` : `${m}`);

  return (
    <div
      className={`w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-sm z-50 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* <div className="mb-3 text-sm font-semibold text-gray-700 flex items-center justify-between">
        <div>Time</div>
        <div className="text-xs text-gray-500">
          {hour}:{formatMin(minute)} {meridiem}
        </div>
      </div> */}

      <div className="flex gap-4 justify-center">
        <div className="flex flex-col items-center w-16">
          <div className="text-xs font-medium text-gray-500 mb-1">Hour</div>
          <div
            ref={hourRef}
            tabIndex={0}
            onKeyDown={(e) => handleKey("hour", e)}
            className="overflow-auto max-h-48 snap-y snap-mandatory w-full rounded-md border border-gray-100"
          >
            {HOURS.map((h) => (
              <div
                key={h}
                onClick={() => setHour(h)}
                className={`h-9 flex items-center justify-center snap-start text-sm rounded transition
                  ${
                    h === hour
                      ? "bg-purple-500 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                {h}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center w-16">
          <div className="text-xs font-medium text-gray-500 mb-1">Min</div>
          <div
            ref={minuteRef}
            tabIndex={0}
            onKeyDown={(e) => handleKey("minute", e)}
            className="overflow-auto max-h-48 snap-y snap-mandatory w-full rounded-md border border-gray-100"
          >
            {Array.from({ length: Math.round(60 / minuteStep) }).map(
              (_, idx) => {
                const m = MINUTES[idx * minuteStep];
                const isSelected = m === minute;
                return (
                  <div
                    key={m}
                    onClick={() => setMinute(m)}
                    className={`h-9 flex items-center justify-center snap-start text-sm rounded transition
                      ${
                        isSelected
                          ? "bg-purple-500 text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                      }`}
                  >
                    {formatMin(m)}
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="flex flex-col items-center w-16">
          <div className="text-xs font-medium text-gray-500 mb-1">AM/PM</div>
          <div
            ref={meridiemRef}
            tabIndex={0}
            onKeyDown={(e) => handleKey("meridiem", e)}
            className="overflow-auto max-h-48 snap-y snap-mandatory w-full rounded-md border border-gray-100"
          >
            {["AM", "PM"].map((m) => (
              <div
                key={m}
                onClick={() => setMeridiem(m)}
                className={`h-9 flex items-center justify-center snap-start text-sm rounded transition
                  ${
                    m === meridiem
                      ? "bg-purple-500 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => {
            const { hour: h, minute: m, meridiem: mm } = to12Hour(date);
            setHour(h);
            setMinute(Math.round(m / minuteStep) * minuteStep);
            setMeridiem(mm);
          }}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>

        <button
          onClick={() => {
            onChange?.(buildDateFromSelection(hour, minute, meridiem));
            onClose?.();
          }}
          className="text-xs px-3 py-1 rounded bg-purple-500 text-white hover:opacity-95"
          ref={setRef}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default TimePickerCustom;
