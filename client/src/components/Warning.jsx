import React from "react";

function Warning({ text, deleteAns, closeWarningSign }) {
  const setAnswer = (answer) => {
    deleteAns(answer);
    closeWarningSign();
  };
  return (
    <div className="bg-black opacity-75 h-screen w-screen absolute top-0 left-0 z-20 flex flex-col justify-center items-center">
      <h1 className="text-red-700 text-xl">
        Are you sure you want to delete {text} ?
      </h1>
      <div className="flex mt-3 gap-3">
        <button
          className="bg-red-700 text-white p-3 hover:opacity-90 rounded-lg"
          onClick={() => setAnswer(true)}
        >
          Yes,Delete
        </button>
        <button
          className="bg-green-700 text-white p-3 hover:opacity-90 rounded-lg"
          onClick={() => setAnswer(false)}
        >
          No, Cancel
        </button>
      </div>
    </div>
  );
}

export default Warning;
