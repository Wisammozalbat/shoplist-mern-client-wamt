import React from 'react'
import { Sidebar } from '../components'

export const Layout = (props) => {
  return (
    <div className="flex w-full h-full relative">
      <Sidebar
        className={
          'w-2/12 bg-zinc-400 container-shadow px-3 py-5 flex flex-col items-center'
        }
      ></Sidebar>
      <div className="section-container">{props.children}</div>
    </div>
  )
}
