import { Spinner } from "react-bootstrap";

import React from 'react'

function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        margin: "auto"
      }}
    />
    <h2 className="py-3">Loading...</h2>
  </div>
  
  )
}

export default Loader