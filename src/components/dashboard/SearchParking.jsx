import { TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';

function SearchParking({ onSearch }) {
  const [searchName, setSearchName] = useState('');

  const handleInputChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchName);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
    <TextInput
      type="text"
      placeholder="Search parking..."
      value={searchName}
      onChange={handleInputChange}
      className="mr-2"
      onKeyDown={handleKeyDown}
    />
    <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      <FaSearch />
    </button>
  </form>
  )
}

export default SearchParking
