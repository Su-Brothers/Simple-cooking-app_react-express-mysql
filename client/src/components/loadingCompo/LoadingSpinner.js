import React from 'react'
import "./loading-spinner.scss";
import {AiOutlineLoading3Quarters} from "react-icons/ai"
function LoadingSpinner({size}) {
    return (
        <div className={`loading-spinner ${size}`}>
            <AiOutlineLoading3Quarters/>
        </div>
    )
}
LoadingSpinner.defaultProps = {
    size: "middle"
}
export default LoadingSpinner
