"use client";
import { useState } from 'react';

export function ValidationPanel({ errors }: { errors: Record<string, string[]>; className?:string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const errorCount = Object.values(errors).reduce((total, messages) => total + messages.length, 0);
  
  return (
    <div className={`
      fixed left-0 bottom-0 -translate-y-1/2
      flex items-stretch
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-96' : 'w-16'}
      h-64
      bg-red-50/90 backdrop-blur-sm
      border-r-2 border-red-200
      rounded-r-lg overflow-hidden
      shadow-lg hover:shadow-xl
      z-50
    `}>

      <div className={`
        flex-1 p-4
        transition-opacity duration-200
        ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 -ml-16'}
        overflow-y-auto
      `}>
        <div className="min-w-[300px]">
          <h3 className="
            font-bold text-lg
            text-red-900
            mb-3 pb-2
            border-b border-red-200
          ">
            Validation Issues
          </h3>
          <ul className="space-y-2">
            {Object.entries(errors).flatMap(([field, messages]) =>
              messages.map((message, i) => (
                <li 
                  key={`${field}-${i}`}
                  className="
                    text-red-800
                    px-3 py-2
                    bg-red-50
                    rounded
                    border-l-4 border-red-400
                  "
                >
                  <strong className="capitalize">{field}:</strong> {message}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      
      <div 
        className="
          w-16 flex-shrink-0
          bg-red-100 hover:bg-red-200
          flex items-center justify-center
          cursor-pointer
          transition-colors duration-200
        "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="
          font-bold text-xl
          transform -rotate-90
          whitespace-nowrap
          text-red-800
          select-none
        ">
          {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
        </span>
      </div>
    </div>
  );
}