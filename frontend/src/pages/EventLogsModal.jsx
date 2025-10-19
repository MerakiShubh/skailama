import React from 'react';
import dayjs from 'dayjs';
import { X, Clock } from 'lucide-react';
import { useGetEventLogs } from '../hooks/event.hook.js';

const EventLogsModal = ({ eventId, onClose }) => {
  const { data, isLoading, isError } = useGetEventLogs(eventId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-md w-[400px]">
          <p className="text-center text-gray-600">Loading event logs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-md w-[400px]">
          <p className="text-center text-red-500">Failed to load event logs</p>
        </div>
      </div>
    );
  }

  const logs = data?.data || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-7/8 lg:w-full max-w-xl max-h-[80vh] overflow-y-auto p-4 relative">
        <div className="flex justify-between items-center  pb-2 mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Event Update History</h2>
          <button onClick={onClose} className="p-0.5 rounded-lg hover:border hover:border-purple-600">
            <X size={18} />
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No update logs found for this event.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="border border-gray-200 rounded-xl p-3 flex gap-3 items-start">
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-500 mt-1 flex-shrink-0" size={16} />
                    <p className="text-sm font-light text-gray-400 mt-1">
                      {dayjs(log.updatedAt).format('MMM DD, YYYY [at] hh:mm A')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLogsModal;
