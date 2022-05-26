import React, { useEffect } from 'react'
import { getUser, setUserAttr, validUser } from "../../user"

const pageCurtainStyle = {
    background: 'rgba(0,0,0,0.8)',
    width: '100vw',
    height: '100vh',
    zIndex: 10,
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
  
  }
  const modalStyle = {
    background: 'rgba(255,255,255,1)',
    fontFamily: '\'Josefin Sans\', cursive',
    padding: '5rem',
    margin: 'auto',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    
  }

export const UserEditor = ({is_open, set_open}) => {

    const [USER, setUSER] = React.useState()

    useEffect(()=>{
      if(validUser()) {
        set_open(false)
        setUSER({...getUser()})
      }
    }, [])

    const setName = (e) => {
        setUserAttr('name', e.target.value);
        console.log(e.target.value)
        setUSER({...getUser()})
    }

    const setColor = (e) => {
      setUserAttr('color', e.target.value);
      console.log(e.target.value)
      setUSER({...getUser()})
  }
  
    const submitProfile = () => {
      if (validUser()) {
        set_open(false)
      } else {

      }
    }

    const avatarStyles = {
        background: USER ? USER.color : 'wheat',
        width: '5rem',
        height: '5rem',
        margin: 'auto',
        borderRadius: '100%',
        display: "flex",
        fontSize: '3rem'
      }

    return (
        <div style={pageCurtainStyle}>
            <div style={modalStyle}>
                <h1 style={{fontFamily: '\'Yomogi\', cursive'}}>
                  Welcome to Dated
                </h1>
                <h2>
                  Let's get you set up with a user avatar.
                </h2>
                <p>
                  All data is saved locally, <b>nothing</b> is ever uploaded to the cloud
                </p>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div style={avatarStyles}>
                      <p style={{margin: 'auto', width: 'min-width'}}>{USER ? USER.name.slice(0,1) : ''}</p>
                  </div>
                  <div style={{margin: '2rem auto', display: 'flex', flexDirection: 'column'}}>
                    <input style={{padding: '.5rem', fontSize: '1.5rem', textAlign: 'center'}} onKeyUp={setName} type="text"/>
                    <input style={{padding: '.5rem', fontSize: '1.5rem'}} onChange={setColor} type="color"/>
                  </div>
                </div>
                <button onClick={submitProfile}>
                  Let me in
                </button>
            </div>
        </div>
    )
}