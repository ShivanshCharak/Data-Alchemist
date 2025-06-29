"use client";

import { useState } from "react";
import { context } from "./Context";
import { IClient, IWorker, ITask,IHints } from "@/types/sheets";

export function AIValidatorPanel({ clients, workers, tasks }: {
  clients:IClient[],
  workers:IWorker[],
  tasks:ITask[]
}) {
  const [hints, setHints] = useState<IHints[]>([]);
  const [loading, setLoading] = useState(false);
  const data ={
    clients,workers,tasks
  }
  const handleValidate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, context }),
      });
      console.log(res)
      const response = await res.json();
      setHints(response.hints || []);
      console.log(hints)
    } catch {
      alert("Failed to validate using AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6">
      <h2 className="text-lg font-semibold text-red-700 mb-2">🧠 AI Validator</h2>
      <button
        onClick={handleValidate}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Validating..." : "Validate with AI"}
      </button>

      <div className="mt-4 bg-white p-5 rounded border">
        {hints.length > 0 ? (
          <ul className="space-y-2 text-sm text-red-700 list-disc pl-5">
            {hints.map((hint:IHints,index:number)=>(
            
            <li key={index}>
                At Row {hint.rowIndex}: Field &quot;{hint.field} &quot; - {hint.error}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-sm text-red-400 italic">No validation hints yet.</p>
        )}
      </div>
    </div>
  );
}
