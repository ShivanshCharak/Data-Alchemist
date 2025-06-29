"use client";
import { useState } from "react";
import { IPriority } from "@/types/sheets";

export function PrioritizationPanel({ onPrioritiesChange }: { onPrioritiesChange: (priorities: IPriority) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weights, setWeights] = useState({
    priorityLevel: 5,
    fairness: 5,
    fulfillment: 5,
    loadBalance: 5,
  });

  const update = (key: string, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    onPrioritiesChange(updated);
  };

  return (
    <div className={`
      fixed right-0 top-[680px] -translate-y-1/2
      flex items-stretch
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-96' : 'w-16'}
      h-64
      bg-purple-50/90 backdrop-blur-sm
      border-l-2 border-purple-200
      rounded-l-lg overflow-hidden
      shadow-lg hover:shadow-xl
      z-30
    `}>

      <div 
        className="
          w-16 flex-shrink-0
          bg-purple-100 hover:bg-purple-200
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
          text-purple-800
          select-none
        ">
          Weights
        </span>
      </div>

  
      <div className={`
        flex-1 p-4
        transition-opacity duration-200
        ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}
        overflow-y-auto
      `}>
        <div className="min-w-[300px]">
          <h3 className="
            font-bold text-lg
            text-purple-900
            mb-3 pb-2
            border-b border-purple-200
          ">
             Prioritization Weights
          </h3>
          
          <div className="space-y-4">
            {Object.keys(weights).map((key) => (
              <div key={key} className="flex items-center space-x-3">
                <label className="w-28 capitalize text-purple-900">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={weights[key as keyof typeof weights]}
                  onChange={(e) => update(key, parseInt(e.target.value))}
                  className="flex-1 accent-purple-600"
                />
                <span className="w-6 text-center font-medium text-purple-900">
                  {weights[key as keyof typeof weights]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}