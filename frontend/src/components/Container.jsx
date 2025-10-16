import React from "react";
import CreateEventForm from "./CreateEventForm";
import Events from "./Events";

const Container = () => {
  return (
    <>
      <div className="mx-auto my-auto p-3  h-full md:h-3/4 w-8/12 bg-gray-300/20 rounded-lg">
        <div className="w-full h-1/9 mb-1 text-center md:text-left">
          <h1 className="text-black font-bold text-2xl">Event Management</h1>
          <p className="font-bold text-md text-gray-400">
            Create and manage events across multiple events
          </p>
        </div>
        <div className="w-full flex flex-col md:flex-row h-5/6 gap-8">
          <CreateEventForm />
          <Events />
        </div>
      </div>
    </>
  );
};

export default Container;
