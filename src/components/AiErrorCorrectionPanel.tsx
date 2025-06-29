"use client";
import { useState } from "react";
import {context} from '@/components/Context'
import { IClient, IWorker,ITask } from "@/types/sheets";

export function AIErrorCorrectionPanel({clients, workers,tasks }: {
  clients: IClient[],
  workers: IWorker[],
  tasks: ITask[],
}) {
    const [loading, setLoading] = useState(false);
    const [suggestions,setSuggestions] = useState<string>("")

    const handleCorrection = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ai-correct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data:{clients,workers,tasks}, context }),
            });
            const { correctedData } = await res.json();
            
            
            setSuggestions(correctedData)
    
        } catch (e) {
          console.log(e)
            alert("Failed to correct data");
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className=" z-50 bg-green-100 px-4 py-2 rounded shadow">
      <button
        onClick={handleCorrection}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Correcting..." : "AI: Fix Errors"}

      </button>
      <div className="">
        <h1 className="font-semibold text-green-600 mt-6">Fixed Errors</h1>
        <div className="bg-white p-4 rounded border-gray-200 overflow-auto max-h-96">
           {suggestions?<code className="text-gray-500 whitespace-pre-wrap">{suggestions}</code>:<p className="text-gray-500 text-center font-semibold">No corrections suggested yet</p>}

        </div>
      </div>
    </div>
  );
}
