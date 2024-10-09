import Image from "next/image";
import React from "react";

const ImagePreview = ({ imagePreview, onRemoveImage }) => {
  return (
    imagePreview && (
      <div className="mt-4">
        <Image
          src={imagePreview}
          alt="Preview"
          className="max-w-xs h-auto rounded shadow-lg"
        />
        <button
          type="button"
          onClick={onRemoveImage}
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remove Image
        </button>
      </div>
    )
  );
};

export default ImagePreview;
