import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DataInterface } from "../App";
import VerticalDivider from "./VerticalDivider";
import { Line } from "react-chartjs-2";

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
};

const isSameMonth = (a: Date, b: Date) => {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
};

interface StatisticLayoutProps {
  todayRoadData: DataInterface[];
  roadData: DataInterface[];
}

function StatisticLayout({ todayRoadData, roadData }: StatisticLayoutProps) {
  const [prevData, setPrevData] = useState(0);

  const [currentMonthData, setCurrentMonthData] = useState(0);
  const [prevMonthData, setPrevMonthData] = useState(0);

  const [prevValue, setPrevValue] = useState(0);
  const [prevMonthValue, setPrevMonthValue] = useState(0);

  useEffect(() => {
    let prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);
    let temp = roadData.filter((data) => isSameDay(prevDay, data.time));
    setPrevData(temp.length);

    let currentMonth = new Date();
    temp = roadData.filter((data) => isSameMonth(currentMonth, data.time));
    setCurrentMonthData(temp.length);

    let prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    temp = roadData.filter((data) => isSameMonth(prevMonth, data.time));
    setPrevMonthData(temp.length);

    setPrevValue(todayRoadData.length - prevData);
    setPrevMonthValue(currentMonthData - prevMonthData);
  }, [roadData, todayRoadData, prevData, prevMonthData, currentMonthData]);

  let graphData = [6, 5, 4, 3, 2, 1, 0]
    .map((dayOffset) => {
      let temp = new Date(new Date().setHours(0, 0, 0, 0));
      temp.setDate(temp.getDate() - dayOffset);
      return temp;
    })
    .map((day) => ({
      date: day,
      count: roadData.filter((data) => isSameDay(day, data.time)).length,
    }));

  const data = {
    labels: graphData.map(
      (e) =>
        `${e.date.getFullYear()}년 ${
          e.date.getMonth() + 1
        }월 ${e.date.getDate()}일`
    ),
    datasets: [
      {
        label: "",
        data: graphData.map((e) => e.count),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        lineTension: 0.3,
      },
    ],
  };

  return (
    <div className="topStatistic itemContainer">
      <Row gutter={16}>
        <Line data={data} />
      </Row>
      <VerticalDivider height={80} />
      <Row gutter={16}>
        <Col span={12}>
          <div className="ant-statistic-title">오늘 보고된 포트홀</div>
          <div className="statistic-main">{todayRoadData.length}개</div>
        </Col>
        <Col span={12}>
          <div className="ant-statistic-title">지금까지 보고된 포트홀</div>
          <div className="statistic-main">{roadData.length}개</div>
        </Col>
      </Row>
      <VerticalDivider height={80} />
      <Row gutter={16}>
        <Col span={12}>
          <div className="ant-statistic-title">전날 대비 증가량</div>
          <span
            className="statistic-main"
            style={{
              color:
                prevData === 0 && todayRoadData.length === 0
                  ? "inherit"
                  : todayRoadData.length > prevData
                  ? "#cf1322"
                  : "#3f8600",
            }}
          >
            {prevData === 0 &&
            todayRoadData.length === 0 ? undefined : todayRoadData.length >
              prevData ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            {prevValue}개
          </span>
        </Col>
        <Col span={12}>
          <div className="ant-statistic-title">전월 대비 증가량</div>
          <span
            className="statistic-main"
            style={{
              color:
                prevMonthData === 0 && currentMonthData === 0
                  ? "inherit"
                  : currentMonthData > prevMonthData
                  ? "#cf1322"
                  : "#3f8600",
            }}
          >
            {prevMonthData === 0 &&
            currentMonthData === 0 ? undefined : currentMonthData >
              prevMonthData ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            {prevMonthValue}개
          </span>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticLayout;
