import React from 'react'
import { useParams } from 'react-router-dom'

export default function Number() {
    let {num} = useParams()
  return (
    <div>{num}</div>
  )
}
