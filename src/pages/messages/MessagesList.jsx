import React from 'react'
import { Tabs,Checkbox, Table ,Button} from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function MessagesList() {
  return (
    <>
    {/* // menu items */}
      <div className='m-5'>
        <div className="grid w-full max-w-[23rem] grid-cols-8 gap-2 ">
          <input id="npm-install" type="text"
              className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 "
              value="Search Email"
            />
            <Button className="bg-primary hover:bg-primary-hover focus:ring-0 w-20"   ><CiSearch size="20px "/>Search</Button>     
        </div>
      </div>
      <div className="overflow-x-auto">
        <Tabs aria-label="Full width tabs" variant="fullWidth">
          <Tabs.Item active title="Profile" icon={HiUserCircle}></Tabs.Item>
          <Tabs.Item title="Dashboard" icon={MdDashboard}></Tabs.Item>
          <Tabs.Item title="Settings" icon={HiAdjustments}></Tabs.Item>
          <Tabs.Item title="Contacts" icon={HiClipboardList}></Tabs.Item>
        </Tabs>
      </div>
      {/* //table information */}
      <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4"><Checkbox /></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{'Apple MacBook Pro 17"'}</Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4"><Checkbox /></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Microsoft Surface Pro</Table.Cell><Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">Edit</a>
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4"><Checkbox /></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Magic Mouse 2</Table.Cell><Table.Cell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
    </>
  )
}

export default MessagesList
