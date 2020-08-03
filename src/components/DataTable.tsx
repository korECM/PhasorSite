import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { DataInterface } from "../App";

const columns: ColumnsType<any> = [
  {
    title: "위도",
    dataIndex: "latitude",
    key: "latitude",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "경도",
    dataIndex: "longitude",
    key: "longitude",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "심각도",
    dataIndex: "magnitude",
    key: "magnitude",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "시간",
    dataIndex: "time",
    key: "time",
    render: (text) => <p>{text}</p>,
  },
];

interface DataTableDataProps {
  rawData: DataInterface[];
}

function DataTable({ rawData }: DataTableDataProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const temp = rawData.map((e, index) => ({
      key: index,
      latitude: e.latitude,
      longitude: e.longitude,
      magnitude: e.magnitude,
      time: e.dateString,
    }));
    setData(temp);
  }, [rawData]);

  return <Table columns={columns} dataSource={data}></Table>;
}

export default DataTable;
