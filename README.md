# 📙자취요리백과사전
> 본 프로젝트는 CRA(Create-React-App)으로 초기구성을 하였습니다.

![자취요리백과사전](./client/src/images/jabakLogo_v4.png)

**프로젝트 링크:** https://dn9g4x7ek29ym.cloudfront.net

# 프로젝트 동기

근 3년간 자취를 하면서 자취생들을 위한 요리사이트가 있었으면 좋겠다고 생각했습니다. 시중에 있는 사이트들은 전부 보기가 어려웠고 주부를 위한 사이트가 대부분이었기 때문입니다.

또한, 리액트를 공부하고 있던 터라 무엇을 만들지 고민하다가 자취생들을 위한 SPA형식의 요리sns를 만들자라고 결심하고 실행에 옮겼습니다!

# 프로젝트에 사용된 주요기술

> 개인적으로 중요하다고 생각되는 스택들만 나열했습니다!(사용빈도가 적은 라이브러리들은 넣지 않았습니다.)

 * 배포
   - React(AWS S3, with cloudfront)
   - Express(AWS EC2)
   - MYSQL(Digitalocean)
 
 * 프론트엔드 (REACT)
   - React(v16.13.1)
   - React-router-dom
   - Redux
   - Redux-thunk
   - SCSS
   - Axios
   - lodash
  
 * 백엔드 (Nodejs)
   - Express(v4.17.1)
   - bcrypt
   - cors
   - jsonwebtoken
   - multer
   - --
    * DBMS
      - mysql
      
# 간략한 폴더구조

> 간략하게 폴더의 구조와 설명을 포현했습니다.(파일이 너무 많아서 기본 구조는 넣지 않았습니다. APP.js,index.js 등)

 * client
   * src
     - components
       - cooks (재료검색 페이지에 대한 컴포넌트들을 모아놓았다.)
       - hoc (페이지간 유저인증을 위한 auth 고차 컴포넌트가 있는 폴더)
       - loadingCompo (로딩 관련 컴포넌트들)
       - posts (글목록,글상세,글수정 등 포스트 관련 컴포넌트들이 모여있다.)
       - sides (페이지에 고정되어 있는 aside,nav등이 있다.)
       - users (유저와 관련된 모든 컴포넌트 ex.마이페이지,회원가입)
       - writes (글쓰기 관련된 컴포넌트를 모아놓았다.)
       - custom-module (DB에 들어간 영어명칭들을 다시 한글로 변환해주는 모듈)
       - images (기본 이미지 모음)
       - modules (리덕스 모듈 모음)
       - reducer (루트 리듀서 파일)
       - styles (컴포넌트들의 스타일 모음)
     - etc...
    
 * server
    - config (환경변수등이 들어있다. ex.DB 정보, jwt 정보)
    - middleware (사용자 인증 auth와 관련된 미들웨어가 들어있다.)
    - routes (rest api를 구현할때 라우트를 보기 쉽게 분리 하기위해 나누어놨다.)
    - uploads (서버에 들어간 이미지들이 들어있다.)
    - etc...
   
# 주요 기능

  ## 게시판
  1. 글상세, 글쓰기, 글 수정, 글 삭제 기능 (crud)
  2. 글목록을 인기순,최신순,조회순,정확순 등으로 정렬 가능
  3. 한식,중식,일식 등 타임라인의 카테고리 기능
  4. 페이지네이션은 무한 스크롤로 구현
  5. 게시글 좋아요 기능
  6. 조회수 기능
  
  ## 댓글
  1. 기본적인 댓글기능(댓글 작성,댓글 삭제)
  2. 댓글 좋아요
  
  ## 유저
  1. 회원가입 및 로그인 기능
  2. auth 고차컴포넌트를 통한 페이지간 유저 인증
  3. 마이페이지, 유저 정보보기 기능
  4. 금주의 요리사(유저 랭킹 기능)
  5. 좋아요한 레시피뷰 기능
  
  ## 검색
  1. 일반 게시글 검색 기능, 태그 검색 기능
  2. 사이트에 있는 재료들중 원하는 재료를 통한 재료검색기능
   
# 기획

* 프론트엔드
   ![오븐](https://user-images.githubusercontent.com/61229227/96288875-135fad00-101f-11eb-9325-0cd00cfd3e55.PNG)
   ![오븐2](https://user-images.githubusercontent.com/61229227/96288887-178bca80-101f-11eb-83d8-00d1deb39061.PNG)
   - ui를 잡기 위해 카카오오븐을 사용하였다.
* 백엔드
   
   

# 프로젝트 기능 설명

# 배운 점

# 보완할 점
 










   
