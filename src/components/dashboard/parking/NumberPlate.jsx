import React from 'react'

function NumberPlate() {
  return (
    <div className='w-32 h-auto border-[2px] border-blue-600 rounded-lg flex justify-center items-center flex-col'>
      <h2 className='text-[12px]'>ភ្នំពេញ</h2>
      <span className='text-xl text-blue-600'>1A-0001</span>
      <div className='h-[1px] border-gray-700 border-[1px] w-[95%]'></div>      
      <span className='text-[12px] text-red-500'>Phnom Penh</span>
    </div>
  )
}

export default NumberPlate
