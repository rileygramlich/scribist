import React from 'react'
import * as usersService from "../../utilities/users-service"

export default function Profile() {
  async function handleCheckToken() {
    const expDate = await usersService.checkToken()
    console.log(expDate)
  }

  return (
    <div className="Profile">
    <div>Profile</div>
    <button onClick={handleCheckToken}>Check when my login expires</button>
    </div>
  )
}
