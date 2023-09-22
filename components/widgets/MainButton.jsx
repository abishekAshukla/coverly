import React from "react";

const MainButton = ({ icon, text, bgColor, textColor, Type, onClickFunc }) => {
  return (
    <button
      onClick={onClickFunc}
      type={Type}
      className={`bg-${bgColor} flex justify-center items-center w-full px-8 py-2 mt-5 border-2 rounded font-medium`}
    >
      {icon} <span className={`text-${textColor}`}>{text}</span>
    </button>
  );
};

export default MainButton;
