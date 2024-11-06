import React from 'react'

function MyTableHead({children, className = ''}) {
  return (
    <thead className={`border-t border-b border-b-gray-300 border-t-gray-300 ${className}`}>
      {children}
    </thead>
  )
}

export default MyTableHead
