const Tooltip = ({ text, children }) => {
  return (
    <div className="tooltip relative">
      <div className="tooltip-content  absolute bg-gray-100 text-black text-xs py-1 px-2 rounded top-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity">
        {text}
      </div>
      {children}
      <style jsx>{`
        .tooltip:hover .tooltip-content {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
