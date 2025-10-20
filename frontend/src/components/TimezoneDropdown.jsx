import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useState } from 'react';

export default function TimezoneDropDown({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Kolkata',
  ];

  const filtered = timezones.filter((zone) => zone.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full mt-2 relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-200/70 hover:bg-purple-500/90 rounded-md h-10 cursor-pointer pl-4 pr-10"
      >
        <span className="text-sm text-gray-700 font-medium">{selected || 'Select timezone'}</span>
        <ChevronsUpDown className="absolute size-6 right-3 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 h-60 overflow-y-scroll overflow-x-hidden bg-white rounded-md shadow-lg border border-gray-300 z-10">
          <div className="flex items-center h-8 w-full border-b border-gray-200 bg-gray-50 gap-x-2 sticky top-0">
            <div className="flex items-center w-5 ml-5">
              <Search className="size-4 text-gray-400 " />
            </div>

            <input
              type="text"
              placeholder="Search timezone..."
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.map((zone) => (
            <div
              key={zone}
              onClick={() => {
                onSelect(zone);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/80 rounded-lg cursor-pointer"
            >
              <div className="w-5 flex justify-center">
                {selected === zone && <Check className="text-gray-400 size-5" />}
              </div>
              <span className="ml-2">{zone}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
