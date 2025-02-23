"use client";

import { useState } from "react";

export default function ControlsGuide() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {isVisible ? "Hide Controls" : "Controls"}
      </button>

      {isVisible && (
        <div className="mt-2 bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl">
          <div className="grid grid-cols-3 gap-3 text-sm">
            {/* Movement Controls */}
            <div className="col-span-3 mb-2 text-center font-semibold text-blue-400">
              Movement
            </div>
            <div className="col-span-3 flex flex-col items-center gap-1">
              <kbd className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded">
                W
              </kbd>
              <div className="flex gap-1">
                <kbd className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded">
                  A
                </kbd>
                <kbd className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded">
                  S
                </kbd>
                <kbd className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded">
                  D
                </kbd>
              </div>
            </div>

            {/* Jump */}
            <div className="col-span-3 mt-4 mb-2 text-center font-semibold text-green-400">
              Jump
            </div>
            <div className="col-span-3 flex justify-center">
              <kbd className="px-4 py-1 bg-gray-700 rounded">Space</kbd>
            </div>

            {/* Mouse Controls */}
            <div className="col-span-3 mt-4 mb-2 text-center font-semibold text-purple-400">
              Camera
            </div>
            <div className="col-span-3 flex flex-col items-center">
              <p className="text-xs text-gray-300">화면을 클릭해 주세요.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
