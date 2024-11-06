import { Table, TableCell, TableRow } from "flowbite-react";
import React from "react";

function UserNotFound() {
  return (
    <tbody>
      <tr>
        <td colSpan={8} className="w-full h-[75vh] text-center bg-transparent">
          <img
            src="/images/userNotFound.svg"
            alt="userNotFound"
            className="w-64 h-64 object-contain mb-4 mx-auto"
          />
          <p className="text-lg font-semibold">User Not Found</p>
          <p className="text-sm text-gray-500">
            We couldn't find the user you're looking for.
          </p>
        </td>
      </tr>
    </tbody>
  );
}

export default UserNotFound;
