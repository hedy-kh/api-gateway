import React, { Children } from 'react'

export default function Button({Children}) {
    return (
        <button style={{backgroundColor:'crimson'}}>
          {Children}
        </button>
    )
}
