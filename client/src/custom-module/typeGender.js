//디비에 저장된 값들을 한국어로 변환 하기 위한 모듈 ex) 한식 => typeKo

//포스트 p
export const pGenderType = (target) => {
  //요리 종류
  if (target === "typeKo") {
    return "한식";
  } else if (target === "typeChin") {
    return "중식";
  } else if (target === "typeJa") {
    return "일식";
  } else if (target === "typeWest") {
    return "양식";
  } else if (target === "typeEtc") {
    return "기타";
  }
};

export const pGenderDiff = (target) => {
  //난이도
  if (target === "diffTop") {
    return "상";
  } else if (target === "diffMiddle") {
    return "중";
  } else if (target === "diffBottom") {
    return "하";
  }
};

export const pGenderTime = (target) => {
  //요리시간
  if (target === "lessTen") {
    return "10분 이내";
  } else if (target === "lessTwenty") {
    return "20분 이내";
  } else if (target === "lessThirty") {
    return "30분 이내";
  } else if (target === "moreHours") {
    return "1시간 이상";
  }
};
