import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen z-10 bg-black opacity-30 absolute top-0 left-0">
      <div className="rounded-full w-[30px] h-[30px] border-gray-400 border-t-slate-600 animate-spin border-[6px]"></div>
    </div>
  );
};

export default Loading;
