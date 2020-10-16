# 📙자취요리백과사전
![자취요리백과사전](./client/src/images/jabakLogo_v4.png)

**프로젝트 링크:** https://dn9g4x7ek29ym.cloudfront.net

# 프로젝트 동기

근 3년간 자취를 하면서 자취생들을 위한 요리사이트가 있었으면 좋겠다고 생각했습니다. 시중에 있는 사이트들은 전부 보기가 어려웠고 주부를 위한 사이트가 대부분이었기 때문입니다.

또한, 리액트를 공부하고 있던 터라 무엇을 만들지 고민하다가 자취생들을 위한 SPA형식의 요리sns를 만들자라고 결심하고 실행에 옮겼습니다!

# 프로젝트에 사용된 주요기술

> 개인적으로 중요하다고 생객하는 스택들만 나열했습니다!(프로젝트 설명에서 자세히 나옵니다.)

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
   
          
    

   
