import { Skeleton } from '@mui/material'
import React from 'react'

function CustomUserListSeketon() {
  return (
    <>
      {/* Skeleton for search bar */}
      <div className='m-8'>
      <Skeleton variant="rounded" width="100%" height={40} style={{ marginBottom: 20 }} />
      </div>
      {/* Skeleton for table header */}
      <div className='m-8 flex'>
        <Skeleton variant="text" width="10%" height={30} />
        <Skeleton variant="text" width="20%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="15%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="10%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="10%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="10%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="10%" height={30} style={{ marginLeft: 10 }} />
        <Skeleton variant="text" width="15%" height={30} style={{ marginLeft: 10 }} />
      </div>

      {/* Skeleton for table rows */}
      {[...Array(15)].map((_, index) => (
        <div key={index} className='flex m-8'>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="20%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="text" width="15%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="text" width="10%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="text" width="10%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="text" width="10%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="text" width="10%" height={40} style={{ marginLeft: 10 }} />
          <Skeleton variant="rectangular" width="15%" height={40} style={{ marginLeft: 10 }} />
        </div>
      ))}
    </>
  )
}

export default CustomUserListSeketon
