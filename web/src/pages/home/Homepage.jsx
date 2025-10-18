import React from 'react'
import Navbar from '../../navigations/Navbar'
export default function Homepage() {
  return (
    <div>
      <Navbar />
      <a href="../../../rncheatsheet.pdf" download='rncheatsheet.pdf'>download</a>
    </div>
  )
}
