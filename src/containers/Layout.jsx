import React from 'react'

export const Layout = (props) => {
  return (
    <div className='flex w-full h-full'>
        <div>Sidebar</div>
        {props.children}
    </div>
  )
}
