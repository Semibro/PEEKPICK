import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customAxios } from "../../api/customAxios";
import classes from "./FindPicker.module.css";
import { findPeekActions } from "../../store/findPeekSlice";
import PeekLocation from "./PeekLocation";
import { locationActions } from "../../store/locationSlice";
// import { GeoLocation } from "./GeoLocation";
import { useLocation } from "react-router-dom";

const FindPeek = () => {
  const dispatch = useDispatch();
  // Redux store에서 위치값 가져오기
  const getPointX = useSelector((state) => state.geo.point.x);
  const getPointY = useSelector((state) => state.geo.point.y);
  const getDistance = useSelector((state) => state.geo.distance);
  //주변 유져 정보
  const findInfo = useSelector((state) => state.findPeek.peekInfomation);
  //위치 가져왔니?
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  //현재 링크 가져와
  const location = useLocation();
  const currentPathname = location.pathname;

  const emojiCall = useCallback(
    (requestBody) => {
      customAxios.post("/peek", requestBody).then((response) => {
        console.log("넘어온 피크 : ", response);
        const peekArrayOrigin = response.data.data;
        // 최대 n개의 이모지만 보여주기
        const maxEmojisToShow = 8;
        //정보 저장
        const limitedPeekArray = peekArrayOrigin.slice(0, maxEmojisToShow);
        // console.log("넘어온 limitedPeekArray", limitedPeekArray);
        dispatch(findPeekActions.updatePeekInfo(limitedPeekArray));
      });
    },
    [dispatch]
  );

  const GeoLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치값을 Redux store에 저장합니다.
          dispatch(
            locationActions.updateLoc({
              point: {
                x: position.coords.longitude,
                y: position.coords.latitude,
              },
              distance: 10000,
            })
          );
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("위치 못가져왔는디");
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("GeoLocation");
    const fetchLocation = async () => {
      await GeoLocation();
      setIsLocationFetched(true);
    };
    fetchLocation();
  }, [GeoLocation]);

  const handleEmojiCall = useCallback(() => {
    if (!isLocationFetched) {
      return; // 위치 정보가 아직 준비되지 않았으면 작업 중지
    }
    const requestBody = {
      point: {
        x: getPointX,
        y: getPointY,
      },
      distance: getDistance,
    };
    emojiCall(requestBody);
  }, [emojiCall, getPointX, getPointY, getDistance, isLocationFetched]);

  useEffect(() => {
    if (currentPathname === "/peek") {
      console.log("peek1");
      handleEmojiCall();
    }
  }, [currentPathname, handleEmojiCall]);

  return (
    <>
      <div className={classes.ParentreloadBtn}>
        {/* 버튼 클릭 시 handleEmojiCall 함수를 호출 */}
        <button className={classes.reloadBtn} onClick={handleEmojiCall}>
          <img src="./img/reloadBlue.png" alt="새로고침" />
          새로고침
        </button>
      </div>
      <PeekLocation findInfo={findInfo} />
    </>
  );
};

export default FindPeek;
