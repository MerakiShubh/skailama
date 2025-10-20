import React from 'react';
import CreateEventForm from '../pages/CreateEventForm';
import Events from '../pages/Events';
import SelectProfileDropdown from './SelectProfileDropdown';

const Container = () => {
  return (
    <>
      <div className="mx-auto my-auto p-3 w-full h-full md:h-3/4 md:w-8/12 bg-gray-300/20 rounded-lg">
        <div className="w-full flex justify-between items-center  md:h-1/9">
          <div className="w-full">
            <h1 className="text-black font-bold text-2xl">Event Management</h1>
            <p className="font-bold text-md text-gray-400">Create and manage events across multiple events</p>
          </div>
          <div className="w-50">
            {' '}
            <SelectProfileDropdown />
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row md:h-5/6 gap-8">
          <CreateEventForm />
          <Events />
        </div>
      </div>
    </>
  );
};

export default Container;
