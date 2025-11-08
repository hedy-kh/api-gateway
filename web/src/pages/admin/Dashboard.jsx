import React from 'react'
import './Dashboard.css'
import Feed from './Feed';
import Sidebar from './Sidebar';
function Dashboard() {
  return (
    <div className='dsh-grid'>
      <Feed />
      <Sidebar/>
    </div>
  )
}

export default Dashboard