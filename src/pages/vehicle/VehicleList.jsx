import React from "react";
import { Checkbox, Table } from "flowbite-react";
import VehicleRow from "./VehicleRow";
import { useGetVehicleQuery } from "../../redux/feature/vehicles/vehicleApiSlice";

function VehicleList() {
  const {
    data: vehicles,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetVehicleQuery();

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>Error: {error?.data?.message}</p>;
  }

  if (isSuccess){

    const { ids } = vehicles

    const tableContent = ids?.length
    ? ids.map((vehicleId) => <VehicleRow key={vehicleId} vehicleId={vehicleId}/>):
    null

content = (
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox />
            </Table.HeadCell>
            <Table.HeadCell>NumberPate</Table.HeadCell>
            <Table.HeadCell>VehicleModel</Table.HeadCell>
            <Table.HeadCell>VehicleDescription</Table.HeadCell>
            <Table.HeadCell>UserName</Table.HeadCell>
            <Table.HeadCell>User PhoneNumber</Table.HeadCell>
            <Table.HeadCell>CreatedAt</Table.HeadCell>
          </Table.Head>
          <Table.Body>{tableContent}</Table.Body>
        </Table>
      </div>
    );
  }

  return content;
}

export default VehicleList;
