import React from 'react'
import {FaStar} from 'react-icons/fa'
import "./styles/favorites.scss"
import MiniTimeline from './MiniTimeline'



function Favorites() {
    return (
        <div className = "favorites">
            <div className = "border_top">
                <FaStar color = "#ffd700" size = "40px"/> 즐겨찾기
            </div>

            <div className = "border_middle">
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
                <div className = "minitimeline_container"><MiniTimeline/></div>
            </div>
            
        </div>
    )
}

export default Favorites
