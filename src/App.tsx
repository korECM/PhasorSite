import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/database";

import FirebaseConfig from "./firebase.config";

export interface DataInterface {
  latitude: string;
  longitude: string;
  magnitude: string;
  time: string;
}

function App() {
  const [data, setData] = useState<DataInterface[]>([]);

  useEffect(() => {
    firebase.initializeApp(FirebaseConfig);
    const database = firebase.database();
    const dbDataRef = database.ref("/roadDatas");

    dbDataRef.on("value", (snapshot: firebase.database.DataSnapshot) => {
      console.log(snapshot.val());
      setData(Object.values(snapshot.val()) as any);
    });
  }, []);

  return (
    <div className="App">
      {data.map((e) => (
        <div key={e.time}>
          <div>위도 : {e.latitude}</div>
          <div>경도 : {e.longitude}</div>
          <div>심각도 : {e.magnitude}</div>
          <div>시간 : {e.time}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
