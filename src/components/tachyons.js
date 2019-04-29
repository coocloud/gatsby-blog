import React from "react"
import containerStyles from "./tachyons.module.css"

export default ({ children }) => (
    <div className={containerStyles.container}>{children}</div>
)