import React from "react";

const Loader = ({
  color = "black",
  size = "40",
  width = "4",
  tag = "loading...",
}) => {
  const loaderStyle = {
    borderTopColor: color,
    borderTopWidth: `${width}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-70 z-50">
      <div
        className={`border-4 border-transparent border-t-${width} rounded-full animate-spin`}
        style={loaderStyle}
      ></div>
      <p className="text-xl">{tag}</p>
    </div>
  );
};

export default Loader;
