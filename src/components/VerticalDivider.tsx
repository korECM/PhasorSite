import React from "react";

interface VerticalDividerProps {
  height: number;
}

function VerticalDivider({ height }: VerticalDividerProps) {
  return <div style={{ margin: `${height / 2}px 0` }}></div>;
}

export default VerticalDivider;
