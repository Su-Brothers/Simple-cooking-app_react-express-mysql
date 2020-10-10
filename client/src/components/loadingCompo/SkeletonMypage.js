import React from 'react'
import "./skeleton-mypage.scss";
function SkeletonMypage({active}) {
    return (
        <div className={`skeleton-mypage-box ${active ? "" : "active"}`}>
            <div className="bar">
                <div className="indicator">

                </div>
            </div>
            <div className="top-box"></div>
            <div className="bottom-box">
                <div className="img-box"></div>
            </div>
        </div>
    )
}

export default SkeletonMypage
