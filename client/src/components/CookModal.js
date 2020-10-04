import React, { useCallback } from "react";
import "./styles/cook-modal.scss";
import { FaSearch, FaTimes } from "react-icons/fa";
import CookIngreItem from "./CookIngreItem";
import CookResultItem from "./CookResultItem";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import { useRef } from "react";
function CookModal({ history, onExit }) {
  const [loading, setLoading] = useState(false); //로딩 체크

  const [ingreList, setIngreList] = useState([]); //재료 리스트
  const [ingreResult, setIngreResult] = useState([]); //검색할 재료 리스트

  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState("");
  //검색을 하면 여기 데이터가 저장됨. 값이 있으면 이에 대한 값들이 페이징된다.

  const nextId = useRef(0); //key값과 id값으로 쓸거임
  const limitItem = useRef(0); //페이징 처리용 리미트
  const isMounted = useRef(null); //마운트 확인용
  const scrollBox = useRef(null); //ref를 div에 할당하여 스크롤 이벤트 추가

  const getSearchIngre = async () => {
    limitItem.current = 0; //검색이면 0부터 세야함
    setLoading(false);
    if (search === "") {
      const data = await Axios.get(
        `/api/post/cook/getingre/${limitItem.current}`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        if (ingreResult.length > 0 && data.result.length > 0) {
          //결과값에 이미 검색한 결과중 하나가 있으면 active
          const activeData = data.result.map((item) => {
            const findItem = ingreResult.find((rItem) => {
              //이름으로 돌려서 같은걸 찾아낸다.
              if (item.ingre_name === rItem.ingre) {
                return rItem.ingre;
              }
            });
            if (findItem) {
              //find함수가 값을 찾았다면 조건 실행
              return { ...item, active: "active" };
            } else {
              return { ...item };
            }
          });
          console.log(activeData);
          setIngreList(activeData);
        } else {
          setIngreList(data.result);
        }
      }
    } else {
      //인풋값에 값이 입력되었을때
      console.log(search);
      const data = await Axios.get(
        `/api/post/cook/getingre/${limitItem.current}/${search}`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        if (ingreResult.length > 0 && data.result.length > 0) {
          //결과값에 이미 검색한 결과중 하나가 있으면 active
          const activeData = data.result.map((item) => {
            const findItem = ingreResult.find((rItem) => {
              //이름으로 돌려서 같은걸 찾아낸다.
              if (item.ingre_name === rItem.ingre) {
                return rItem.ingre;
              }
            });
            if (findItem) {
              //find함수가 값을 찾았다면 조건 실행
              return { ...item, active: "active" };
            } else {
              return { ...item };
            }
          });
          console.log(activeData);
          setIngreList(activeData);
        } else {
          setIngreList(data.result);
        }
      }
    }
    limitItem.current += 10; //데이터를 가져올때마다 다음 페이지를 위해 +10
    setSearchData(search); //검색어 데이터에 저장
    setLoading(true);
  };

  const getIngre = async () => {
    setLoading(false);
    const data = await Axios.get(`/api/post/cook/getingre/${limitItem.current}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    console.log(data);
    if (data.success) {
      if (ingreResult.length > 0 && data.result.length > 0) {
        //결과값에 이미 검색한 결과중 하나가 있으면 active
        const activeData = data.result.map((item) => {
          const findItem = ingreResult.find((rItem) => {
            //이름으로 돌려서 같은걸 찾아낸다.
            if (item.ingre_name === rItem.ingre) {
              return rItem.ingre;
            }
          });
          if (findItem) {
            //find함수가 값을 찾았다면 조건 실행
            return { ...item, active: "active" };
          } else {
            return { ...item };
          }
        });
        if (isMounted.current) {
          setIngreList(activeData);
        }
      } else {
        if (isMounted.current) {
          setIngreList(data.result);
        }
      }
    }
    if (isMounted.current) {
      limitItem.current += 10; //데이터를 가져올때마다 다음 페이지를 위해 +10
      setLoading(true);
    }
  };
  //검색 재료 리스트 관련 함수
  const addIngre = (name) => {
    //추가
    console.log(name);

    setIngreResult([...ingreResult, { id: nextId.current++, ingre: name }]);
    setIngreList(
      //재료 검색 리스트에 이름이 일치한 것이 있으면 active를 준다.
      ingreList.map((item) =>
        item.ingre_name === name ? { ...item, active: "active" } : item
      )
    );
  };
  const removeIngre = (id, name) => {
    //삭제
    setIngreResult(ingreResult.filter((item) => item.id !== id));
    setIngreList(
      ingreList.map((item) =>
        item.ingre_name === name ? { ...item, active: "" } : item
      )
    );
  };
  const ingredients = () => {
    if (loading) {
      if (ingreList.length) {
        return ingreList.map((item) => (
          <CookIngreItem
            name={item.ingre_name}
            quan={item.quan}
            key={item.ingre_name}
            add={addIngre}
            active={item.active ? item.active : ""}
          />
        ));
      } else {
        return "재료 리스트가 없습니다.";
      }
    } else {
      return "...loading";
    }
  };
  const onInputHandler = (e) => {
    console.log(search);
    setSearch(e.target.value);
  };

  const onScrollHandler = (e) => {
    let box = e.target;
    console.log(box.scrollTop);
    console.log(box.clientHeight);
    console.log(box.scrollHeight);
    if (
      box.scrollTop + box.clientHeight >= box.scrollHeight &&
      box.clientHeight !== box.scrollHeight
    ) {
      console.log("맨아래");
      onLoadHandler();
    }
  };

  const onLoadHandler = async () => {
    console.log(ingreList);
    console.log("Dasdasdasdas");
    if (searchData === "") {
      console.log(limitItem.current);

      const data = await Axios.get(
        `/api/post/cook/getingre/${limitItem.current}`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        if (ingreResult.length > 0 && data.result.length > 0) {
          //결과값에 이미 검색한 결과중 하나가 있으면 active
          const activeData = data.result.map((item) => {
            const findItem = ingreResult.find((rItem) => {
              //이름으로 돌려서 같은걸 찾아낸다.
              if (item.ingre_name === rItem.ingre) {
                return rItem.ingre;
              }
            });
            if (findItem) {
              //find함수가 값을 찾았다면 조건 실행
              return { ...item, active: "active" };
            } else {
              return { ...item };
            }
          });
          if (isMounted.current) {
            setIngreList([...ingreList, ...activeData]);
          }
        } else {
          if (isMounted.current) {
            setIngreList([...ingreList, ...data.result]);
          }
        }
      }
      limitItem.current += 10; //데이터를 가져올때마다 다음 페이지를 위해 +10
    } else {
      const data = await Axios.get(
        `/api/post/cook/getingre/${limitItem.current}/${searchData}`
      )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data.success) {
        if (ingreResult.length > 0 && data.result.length > 0) {
          //결과값에 이미 검색한 결과중 하나가 있으면 active
          const activeData = data.result.map((item) => {
            const findItem = ingreResult.find((rItem) => {
              //이름으로 돌려서 같은걸 찾아낸다.
              if (item.ingre_name === rItem.ingre) {
                return rItem.ingre;
              }
            });
            if (findItem) {
              //find함수가 값을 찾았다면 조건 실행
              return { ...item, active: "active" };
            } else {
              return { ...item };
            }
          });
          if (isMounted.current) {
            setIngreList([...ingreList, ...activeData]);
          }
        } else {
          if (isMounted.current) {
            setIngreList([...ingreList, ...data.result]);
          }
        }
      }
      limitItem.current += 10; //데이터를 가져올때마다 다음 페이지를 위해 +10
    }
  };

  const onLinkHandler = (e) => {
    console.log(ingreResult);
    const data = ingreResult.map((item) => item.ingre);
    console.log(data);
    onExit();
    history.push(`/cook/ingridents?names=${data}`);
  };

  useEffect(() => {
    isMounted.current = true;
    getIngre();
    return () => (isMounted.current = false);
  }, []);
  return (
    <>
      <div className="cook-modal-background" onClick={() => onExit()}></div>
      <div className="cook-modal">
        <div className="cook-modal-exit" onClick={() => onExit()}>
          <FaTimes />
        </div>
        <div className="cook-title">냉장고 속 재료로 요리사가 되어보세요!</div>
        <div className="cook-inner-box">
          <div className="cook-inner-left">
            <div className="cook-search-box">
              <input
                type="text"
                placeholder="검색할 재료를 입력하세요.."
                value={search}
                onChange={onInputHandler}
              />
              <button type="button" onClick={getSearchIngre}>
                <FaSearch />
              </button>
            </div>
            <div
              className="search-list"
              ref={scrollBox}
              onScroll={onScrollHandler}
            >
              {ingredients()}
            </div>
          </div>
          <div className="cook-inner-right">
            <div className="ingre-result-list">
              {ingreResult.map((item) => (
                <CookResultItem
                  id={item.id}
                  name={item.ingre}
                  remove={removeIngre}
                  key={item.id}
                />
              ))}
            </div>
            <button type="button" onClick={onLinkHandler}>
              이 재료로 검색하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CookModal;
