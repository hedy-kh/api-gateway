import React from 'react'
import { NavLink } from 'react-router'
import './Nav.css'
import { useAuth } from '../hooks/useAuth'
export default function Navbar() {
    const { auth } = useAuth();
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
                {auth.user &&
                         <li>
                        <NavLink to='/Developer'>
                            Developer
                        </NavLink>
                    </li>
                }

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
                            <NavLink to={!auth.user?'/login':'/logout'}>
                             {!auth.user?'Login':'Logout'}
                            </NavLink>                        
                    </li>
                </ul>
            </nav>
    )
}
