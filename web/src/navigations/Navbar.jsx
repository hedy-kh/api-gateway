import React from 'react'
import { NavLink } from 'react-router'
import './Nav.css'
import Button from '../components/Button'

export default function Navbar() {
    return (
            <nav className='Nav'>
                <ul>
                    <li>
                        <NavLink to='/'>
                            Homepage
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/Hero'>
                            Section
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/Developer'>
                            Developer
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/About'>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/Contact'>
                            Contact
                        </NavLink>
                    </li>
                    <li className='btn'>
                            <NavLink to='/Login'>
                             Login
                            </NavLink>                        
                    </li>
                </ul>
            </nav>
    )
}
