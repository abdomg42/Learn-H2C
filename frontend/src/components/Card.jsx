// src/components/Card.jsx
import React from "react";

export default function Card({ badge, title, subtitle, type, image }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 ease-out hover:scale-105">
      {badge && (
        <div className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-br-lg">
          {badge}
        </div>
      )}
      <div className="h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
        {type && (
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold uppercase bg-gray-200 rounded-full">
            {type}
          </span>
        )}
      </div>
    </div>
  );
}
