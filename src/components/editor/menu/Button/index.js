import React from 'react'
import './button.css'

export const UserButton = ({ children , ...props}) => {
    return (
        <button className="dtd-button" {...props}>
            {children}
        </button>
    )
}