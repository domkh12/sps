import { Label, TextInput } from 'flowbite-react'
import React from 'react'
import { IoSearch } from 'react-icons/io5'

function SearchParking() {
  return (
    <div>
        <div className="block">         
        </div>
        <TextInput id="base" type="text" icon={IoSearch} sizing="md" placeholder="Search..." />
      </div>
  )
}

export default SearchParking
