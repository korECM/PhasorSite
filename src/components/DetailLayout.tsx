import React, { useState, useCallback } from "react";
import { Row, Col, Space, DatePicker, Timeline } from "antd";
import { DataInterface } from "../App";
import VerticalDivider from "./VerticalDivider";
import DataTable from "./DataTable";
import moment from "moment";
import { auth } from "firebase";

const { RangePicker } = DatePicker;
interface DetailLayoutProps {
  roadData: DataInterface[];
}

function DetailLayout({ roadData }: DetailLayoutProps) {
  const [from, setFrom] = useState(new Date("1999-01-01"));
  const [to, setTo] = useState(new Date("2999-12-31"));

  const onChange = useCallback((dates: any, dateStrings: string[]) => {
    console.log(dates);
    console.log(dateStrings);
    if (dateStrings.every((e) => e.length === 0)) {
      setFrom(new Date("1999-01-01"));
      setTo(new Date("2999-12-31"));
      return;
    }
    let rawFrom = new Date(dateStrings[0]);
    let rawTo = new Date(dateStrings[1]);

    rawFrom.setHours(0, 0, 0);
    setFrom(rawFrom);
    rawTo.setHours(23, 59, 59);
    setTo(rawTo);
  }, []);

  const filterdData = roadData.filter((data) => {
    return from < data.time && data.time < to;
  });

  return (
    <div className="itemContainer">
      <Row gutter={16}>
        <Col span={12}>
          <Space direction="vertical" size={12}>
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              onChange={onChange}
            />
          </Space>
          <DataTable rawData={filterdData} />
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>
    </div>
  );
}

export default DetailLayout;
