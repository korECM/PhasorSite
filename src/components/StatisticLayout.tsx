import React, { useState, useEffect } from "react";
import { Row, Col, Statistic, Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DataInterface } from "../App";
import VerticalDivider from "./VerticalDivider";

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

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="오늘 보고된 포트홀"
            value={`${todayRoadData.length}개`}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="지금까지 보고된 포트홀"
            value={`${roadData.length}개`}
          />
        </Col>
      </Row>
      <VerticalDivider height={80} />
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="전날 대비 증가량"
              value={prevValue}
              valueStyle={{
                color:
                  prevData === 0 && todayRoadData.length === 0
                    ? "inherit"
                    : todayRoadData.length > prevData
                    ? "#cf1322"
                    : "#3f8600",
              }}
              prefix={
                prevData === 0 &&
                todayRoadData.length === 0 ? undefined : todayRoadData.length >
                  prevData ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="개"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="전월 대비 증가량"
              value={prevMonthValue}
              valueStyle={{
                color:
                  prevMonthData === 0 && currentMonthData === 0
                    ? "inherit"
                    : currentMonthData > prevMonthData
                    ? "#cf1322"
                    : "#3f8600",
              }}
              prefix={
                prevMonthData === 0 &&
                currentMonthData === 0 ? undefined : currentMonthData >
                  prevMonthData ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="개"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticLayout;
