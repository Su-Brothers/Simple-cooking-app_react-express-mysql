import React from 'react'
import {FaUserCog, FaStar, FaListAlt, FaBell, FaCog, FaSignOutAlt, FaQuoteLeft, FaQuoteRight} from 'react-icons/fa'
import TimeLine from './TimeLine'
import './styles/mypage.scss'

function MyPage() {
    return (
        <div className = "mypage_container">
            <div className = "mypage">
                <div className = "mypage_bar">MY PAGE</div>
                <div className = "mypage_top">
                    <div className = "mypage_picture">
                    <img 
                        src = "https://placeimg.com/100/100/any"
                        width="100%"
                        height="100%"
                    />
                    </div>
                </div>
                <div className = "user_name"> 김정수 </div>

                <div className = "mypage_middle">
                    <table
                    frame = "void"
                    style = {{border: "0px solid #999", width : "100%", height : "200px", margin : "auto", textAlign :"center"}}>                
                        <tr>
                            <td style = {{border : "1px solid #E2E2E2",  width : "150px", borderLeft : "none"}}><FaUserCog/><br/>회원정보 수정</td>
                            <td style = {{border : "1px solid #E2E2E2", width : "150px", borderLeft : "none"}}><FaStar/><br/>찜목록</td>
                            <td style = {{border : "1px solid #E2E2E2", width : "150px", borderLeft : "none", borderRight : "none"}}><FaListAlt/><br/>공지사항</td>
                        </tr>
                        <tr>
                            <td style = {{border : "1px solid #E2E2E2",  width : "150px", borderLeft : "none", borderTop : "none"}}><FaBell/><br/>알림</td>
                            <td style = {{border : "1px solid #E2E2E2", width : "150px", borderLeft : "none", borderTop : "none"}}><FaCog/><br/>설정</td>
                            <td style = {{border : "1px solid #E2E2E2", width : "150px", borderLeft : "none", borderRight : "none", borderTop : "none"}}><FaSignOutAlt/><br/>로그아웃</td>
                        </tr>
                    </table>
                    <div className = "middle_post">게시물 : 3개</div>
                </div>

                <div className ="mypage_bottom">
                    <div><FaQuoteLeft/></div>
                    <div className = "introduction">회원 정보가 없습니다.</div>
                    <div><FaQuoteRight/></div>

                </div>
            
            </div>
            <div className = "outer">
                <div className = "my_timeline">
                    <div className = "timeline_position"><TimeLine/></div>
                    <div className = "timeline_position"><TimeLine/></div>
                    <div className = "timeline_position"><TimeLine/></div>
                    <div className = "timeline_position"><TimeLine/></div>
                </div>
            </div>
        </div>
    )
}

export default MyPage