import React from 'react'
import './styles/minitimeline.scss'
import {FaHeart, FaEye, FaStopwatch} from "react-icons/fa"
import ranking from '../icons/ranking.svg'
import ranking2 from '../icons/ranking2.svg'
import ranking3 from '../icons/ranking3.svg'

function MiniTimeline() {
    return (
        <div className = "minitime_container">
            <div className = "picture_rank">
                <div className = "picture" >
                <img src = "https://placeimg.com/100/100/any" width = "100%" height = "100%"/>
                </div>
                <div className = "rank">
                    <img src = {ranking} width = "40px" height = "40px"/>
                </div>
            </div>
            <div className = "text">
                여기는 제목
            </div>
            <div className = "aaa">
            <div className = "timeline_name_container">
                <div className = "timeline_picture">
                <img src = "https://placeimg.com/100/100/any" width ="100%" height = "100%"/>
                </div>
                <div className = "timeline_name"> 김정수 </div>
            </div>
            <div className = "miniTimeline_bottom">
            <a><FaHeart color = "red"/> : </a>
            <a><FaEye/> : </a>
            <a><FaStopwatch/> : </a>
            </div>
            </div>
        </div>
    )
}

export default MiniTimeline
