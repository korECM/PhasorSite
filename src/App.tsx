import React, { useEffect, useState, useCallback } from "react";
import * as firebase from "firebase/app";
import "firebase/database";
import {
  Layout,
  notification,
} from "antd";
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

function App() {
  const [roadData, setRoadData] = useState<DataInterface[]>([]);
  const [init, setInit] = useState(false);
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
    <Layout className="container">
      <StatisticLayout roadData={roadData} todayRoadData={todayRoadData} />
      <VerticalDivider height={50} />
      <DetailLayout roadData={roadData} />
      <Footer style={{ textAlign: "center" }}>Phasor</Footer>
    </Layout>
  );
}

export default App;
