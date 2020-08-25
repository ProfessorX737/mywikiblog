import React from "react";

const style = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexFlow: "column",
  overflow: "hidden"
};

export default function ViewPort(props) {
  return <div style={style}>{props.children}</div>;
}
