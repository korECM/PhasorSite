import React, { useState, useCallback } from "react";
import { Row, Col, Space, DatePicker, Timeline } from "antd";
import { DataInterface } from "../App";
import VerticalDivider from "./VerticalDivider";
import DataTable from "./DataTable";
import moment from "moment";

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
      <RangePicker
        ranges={{
          Today: [moment(), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
        }}
        onChange={onChange}
      />
      <VerticalDivider height={30} />
      <DataTable rawData={filterdData} />
    </div>
  );
}

export default DetailLayout;