import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { DataInterface } from "../App";

interface DataTableDataProps {
  rawData: DataInterface[];
  showModal: () => void;
  setImgLink: (link: string) => void;
}

function DataTable({ rawData, showModal, setImgLink }: DataTableDataProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const temp = rawData.map((e, index) => ({
      key: index,
      latitude: e.latitude,
      longitude: e.longitude,
      magnitude: e.magnitude,
      time: e.dateString,
      picture: e.imageLink,
    }));
    setData(temp);
  }, [rawData]);

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
    {
      title: "사진",
      dataIndex: "picture",
      key: "picture",
      render: (imageLink) => (
        <button
          onClick={() => {
            setImgLink(imageLink);
            showModal();
          }}
          className="showPicture"
        >
          사진 보기
        </button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data}></Table>;
}

export default DataTable;
