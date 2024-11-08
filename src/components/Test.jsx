function Test() {
  return (
    <div
      id="dropdownBgHover"
      className="z-10 w-48 bg-white rounded-lg shadow dark:bg-gray-700"
    >
      <ul
        className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownBgHoverButton"
      >
        <li>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <input
              id="checkbox-item-4"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="checkbox-item-4"
              className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
            >
              Default checkbox
            </label>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <input
              id="checkbox-item-5"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="checkbox-item-5"
              className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
            >
              Checked state
            </label>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <input
              id="checkbox-item-6"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              htmlFor="checkbox-item-6"
              className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
            >
              Default checkbox
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Test;
