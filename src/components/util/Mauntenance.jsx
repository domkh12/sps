import { Button } from "flowbite-react";

import { HiOutlineArrowLeft } from "react-icons/hi";

function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center h-auto w-auto">
      <img
        src="/banner/maintenance.svg"
        alt="maintenance"
        className="w-[500px]"
        draggable="false"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Under Maintenance
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry for the inconvenience but we're performing some maintenance at the
        moment. If you need to you can always contact us, otherwise we'll be
        back online shortly!
      </p>
      <Button className="bg-blue-700 hover:bg-blue-800 flex items-center justify-center mx-auto">
        <HiOutlineArrowLeft className="h-5 w-5 mr-2" />
        Back to home
      </Button>
    </div>
  );
}

export default Maintenance;
