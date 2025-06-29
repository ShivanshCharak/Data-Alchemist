"use client";
import { IClient, INLQuery, ITask, IWorker } from "@/types/sheets";
import { useState } from "react";

export function NLQueryBar({clientData,workerData,taskData}: {
  clientData:IClient[],
  workerData:IWorker[],
  taskData:ITask[]
  className?:string
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<INLQuery[]>([]);

  const runQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nl-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, data: {clientData,workerData,taskData} }),
      });
      
      const { filteredData } = await res.json();
  
      setPreviewData(filteredData);
    } catch (err) {
      console.log(err)
      alert("Failed to fetch filtered results");
      setPreviewData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      fixed left-0 top-[30px]
      flex flex-row-reverse items-stretch
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-[30rem]' : 'w-16'}
      h-[18rem]
      bg-teal-50/90 backdrop-blur-sm
      border-r-2 border-teal-200
      rounded-r-lg overflow-hidden
      shadow-lg hover:shadow-xl
      z-10
    `}>
 
      <div 
        className="w-16 flex-shrink-0 bg-teal-100 hover:bg-teal-200 flex items-center justify-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold text-sm transform -rotate-90 text-teal-800 select-none">
          NL Query
        </span>
      </div>

    
      <div className={`
        flex-1 p-4 overflow-y-auto
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'opacity-100 ml-0' : 'opacity-0 w-0 -ml-16'}
      `}>
        <div className="min-w-[300px] space-y-3">
          <h3 className="font-bold text-lg text-teal-900 mb-3 pb-2 border-b border-teal-200">
             Natural Language Query
          </h3>
          
          <input
            className="border rounded px-3 py-2 w-full text-gray-600"
            placeholder='e.g. Show tasks with duration > 2 and preferred phase 3'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
          />
          
          <button
            onClick={runQuery}
            disabled={loading || !prompt.trim()}
            className={`
              px-4 py-2 w-full bg-teal-600 text-white rounded 
              hover:bg-teal-700 transition-colors
              ${loading ? 'opacity-75' : ''}
              ${!prompt.trim() ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">⏳</span> Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                 Run Query
              </span>
            )}
          </button>

          <div className="text-xs text-teal-700 italic mt-2">
            {`Examples: "Tasks with priority > 5", "Group A tasks in phase 2-3`}
          </div>
          {previewData&&previewData.length > 0 && (
            <div className="bg-white mt-4 max-h-56 overflow-y-auto rounded border p-2 text-sm text-gray-700">
              <h4 className="text-teal-800 font-semibold mb-1">📋 Preview ({previewData.length} items)</h4>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
