import { Button, Flowbite } from "flowbite-react";

import React from "react";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <Flowbite>
      <div className="text-center flex flex-col justify-center items-center p-10 min-h-screen gap-5">
        <div className="flex flex-col gap-2 -tracking-tighter">
          <p className="text-5xl font-semibold dark:text-gray-50">Oops</p>
          <p className="text-xl dark:text-gray-200">Something Went Wrong.</p>
          <small className="dark:text-gray-300">Error 404 Not Found</small>
        </div>
        <img src="/images/not_found.svg" alt="not_found" width={600} height={600} />
        <NavLink to={"/dash"}>
          <Button className="bg-primary hover:bg-primary-hover ring-transparent">GO HOME</Button>
        </NavLink>{" "}
      </div>
    </Flowbite>
  );
}

export default NotFound;
