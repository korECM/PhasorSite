import React, { useEffect, useState, useCallback } from "react";
import * as firebase from "firebase/app";
import "firebase/database";
import { Layout, notification, Timeline } from "antd";
import "antd/dist/antd.css";
import "./app.scss";

import FirebaseConfig from "./firebase.config";
import VerticalDivider from "./components/VerticalDivider";
import StatisticLayout from "./components/StatisticLayout";
import DetailLayout from "./components/DetailLayout";

const { Footer } = Layout;
export interface DataInterface {
  latitude: string;
  longitude: string;
  magnitude: string;
  imageLink: string;
  time: Date;
  dateString: string;
}

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

declare global {
  interface Window {
    kakao: any;
  }
}

function App() {
  const [roadData, setRoadData] = useState<DataInterface[]>([]);
  const [init, setInit] = useState(false);
  const [markers, setMarkers] = useState<any>([]);
  const [selected, setSelected] = useState<DataInterface | null>(null);
  const [prevRoadDataNumber, setPrevRoadDataNumber] = useState<number>(0);
  const [todayRoadData, setTodayRoadData] = useState<DataInterface[]>([]);

  const updateData = useCallback((snapshot: firebase.database.DataSnapshot) => {
    let data = Object.values(snapshot.val()) as any[];
    data = data
      .map((e: DataInterface) => ({
        ...e,
        time: new Date(e.time),
      }))
      .map((e: DataInterface) => ({
        ...e,
        dateString: `${e.time.getFullYear()}년 ${
          e.time.getMonth() + 1
        }월 ${e.time.getDay()}일 ${e.time.getHours()}:${e.time.getMinutes()}:${e.time.getSeconds()}`,
      }))
      .reverse();
    console.log(data);
    setRoadData(data);

    let todayData: DataInterface[] = data.filter((rawData: DataInterface) => {
      return isToday(rawData.time);
    });
    setTodayRoadData(todayData);
    console.log(todayData);
  }, []);

  useEffect(() => {
    firebase.initializeApp(FirebaseConfig);
    const database: firebase.database.Database = firebase.database();
    let dbDataRef: firebase.database.Reference = database.ref("/roadDatas");
    dbDataRef.on("value", updateData);
  }, [updateData]);

  useEffect(() => {
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(37.503496, 126.956249),
      level: 2,
    };

    let map = new window.kakao.maps.Map(container, options);

    markers.forEach((marker: any) => {
      marker.setMap(null);
    });

    let tempMarkers: any[] = [];

    roadData.forEach((e: DataInterface) => {
      let marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(e.latitude, e.longitude),
        clickable: true,
      });

      // var iwContent = `<div><img style="height : 100px; width: 100px;" src='${decodeURIComponent(
      //     e.imageLink
      //   )}'/><div style="padding:5px;">심각도 : ${e.magnitude}</div><div/>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      //   iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // // 인포윈도우를 생성합니다
      // var infowindow = new window.kakao.maps.InfoWindow({
      //   content: iwContent,
      //   removable: iwRemoveable,
      // });

      // 마커에 클릭이벤트를 등록합니다
      new window.kakao.maps.event.addListener(marker, "click", function () {
        // 마커 위에 인포윈도우를 표시합니다
        // infowindow.open(map, marker);
        // setImageUrl(decodeURIComponent(e.imageLink));
        setSelected(e);
      });

      tempMarkers.push(marker);
      marker.setMap(map);
    });

    setMarkers(tempMarkers);

    if (init === false && roadData.length !== 0) {
      setPrevRoadDataNumber(roadData.length);
      setInit(true);
    } else if (prevRoadDataNumber < roadData.length) {
      let newData = roadData.slice(prevRoadDataNumber);
      newData.forEach((e: DataInterface) => {
        notification.open({
          message: `${e.dateString} 심각도 : ${e.magnitude}`,
          description: `위도 : ${e.latitude}
경도 : ${e.longitude}
심각도 : ${e.magnitude}
- ${e.dateString}`,
        });
      });
      setPrevRoadDataNumber(roadData.length);
    } else {
      setPrevRoadDataNumber(roadData.length);
    }
  }, [roadData, prevRoadDataNumber, init]);

  return (
    <div>
      <div id="backGround"></div>
      <div id="header">
        <div>Phasor</div>
        <div className="title">
          전국 포트홀
          <br />
          실시간 상황판
        </div>
      </div>
      <div className="container">
        <StatisticLayout roadData={roadData} todayRoadData={todayRoadData} />
        <VerticalDivider height={50} />
        <DetailLayout roadData={roadData} />
        <VerticalDivider height={50} />
        <div className="itemContainer">
          <div className="ant-statistic-title">타임라인</div>
          <VerticalDivider height={40} />
          <Timeline>
            {roadData.slice(0, 7).map((e) => (
              <Timeline.Item key={e.time.toString()}>
                <p>위도 : {e.latitude}</p>
                <p>경도 : {e.longitude}</p>
                <p>심각도 : {e.magnitude}</p>
                <p>시간 : {e.dateString}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
        <div className="itemContainer twoHorizontal">
          <div id="map"></div>
          <div className="imageDetail itemContainer">
            <img
              src={
                selected && selected.imageLink
                  ? decodeURIComponent(selected.imageLink)
                  : "https://crestaproject.com/demo/lontano-pro/wp-content/themes/lontano-pro/images/no-image-slide.png"
              }
            />
            <div className="imageDetailContent">
              <div>위도 : {selected ? selected.latitude : ""}</div>
              <div>경도 : {selected ? selected.longitude : ""}</div>
              <div>심각도 : {selected ? selected.magnitude : ""}</div>
              <div>시간 : {selected ? selected.dateString : ""}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>Phasor</Footer>
    </div>
  );
}

export default App;
