'use client'

import { CircleX } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function UserInfoDisplay({ userInfo, isOpen, onClose }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
const  [IsCopied,SetIsCopied]  = useState(null);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    SetIsCopied(url);
    setTimeout(() => SetIsCopied(null), 500);
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseModal = () => {
    setFullscreenImage(null);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-purple-400 via-orange-500 to-red-500 p-8 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`max-w-4xl mx-auto bg-white rounded shadow-2xl overflow-y-auto h-full relative transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 flex items-center gap-2 right-4 bg-green-500 text-white p-2  hover:bg-red-600 transition-colors duration-200"
        >
          <CircleX />
          Close
        </button>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userInfo?.images.map((image, index) => (
              <div key={image.key} className="group relative">
                <div
                  className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image?.imageUrl?.display}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div 
                  onClick={() => handleImageClick(image)}
                  className="absolute inset-0 flex flex-col
                   items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white text-gray-800 px-4 py-2 mb-2 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(image?.imageUrl?.display);
                    }}
                  >
                    {IsCopied === image?.imageUrl?.display ? "Copied 💕" :'Copy Image URL'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 z-[110] bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-6 w-[90vw] max-w-4xl">
            <button
          onClick={handleCloseModal}
          className="absolute top-4 flex items-center gap-2 right-4 bg-green-500 text-white p-2  hover:bg-red-600 transition-colors duration-200"
        >
          <CircleX />
          Close
        </button>


            <h2 className="text-lg font-bold mb-4">Image Variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex relative flex-col items-center group cursor-pointer">
  <img
    src={fullscreenImage?.imageUrl?.display}
    alt="Display"
    className="rounded-lg shadow-md mb-2"
  />
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <button
      className="bg-white text-gray-800 px-4 py-2 mb-2 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        handleCopyUrl(fullscreenImage?.imageUrl?.display);
      }}
    >
      {IsCopied === fullscreenImage?.imageUrl?.display ? "Copied 💕" : "Copy Image URL"}

    </button>
  </div>
  <p className="text-sm">Display</p>
</div>
<div className="flex relative flex-col items-center group cursor-pointer">
  <img
    src={fullscreenImage?.imageUrl?.medium}
    alt="Display"
    className="rounded-lg shadow-md mb-2"
  />
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <button
      className="bg-white text-gray-800 px-4 py-2 mb-2 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        handleCopyUrl(fullscreenImage?.imageUrl?.medium);
      }}
    >
      {IsCopied === fullscreenImage?.imageUrl?.medium ? "Copied 💕" : "Copy Image URL"}

    </button>
  </div>
  <p className="text-sm">Medium</p>
</div>
<div className="flex relative flex-col items-center group cursor-pointer">
  <img
    src={fullscreenImage?.imageUrl?.thumb}
    alt="Display"
    className="rounded-lg shadow-md mb-2"
  />
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <button
      className="bg-white text-gray-800 px-4 py-2 mb-2 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        handleCopyUrl(fullscreenImage?.imageUrl?.thumb);
      }}
    >
      {IsCopied === fullscreenImage?.imageUrl?.thumb ? "Copied 💕" : "Copy Image URL"}
    </button>
  </div>
  <p className="text-sm">Thumbnail</p>
</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

