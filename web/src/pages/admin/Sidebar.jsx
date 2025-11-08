import React from 'react'
import Product from './Product';
import Task from './Task';
import Users from './Users';
export default function Sidebar({sideCss}) {
  return (
      <div className={sideCss}>
          <Task />
          <Users />
          <Product />
    </div>
  )
}
