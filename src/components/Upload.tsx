
"use client";

import { error } from "node:console";
import { ChangeEvent } from "react";
import * as XLSX from "xlsx";

export function Upload({
  onClientsParsed,
  onWorkersParsed,
  onTasksParsed,
  onValidation,
}: any) {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const parsed: Record<string, any[]> = {
      clients: [],
      workers: [],
      tasks: [],
    };

    for (let file of Array.from(files)) {
      const data = await file.arrayBuffer();
      console.log("data",data)

      const workbook = XLSX.read(data);
      console.log("workbook", workbook)
      for( let sheetName of workbook.SheetNames){
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          console.log("json",json)
      if(sheetName.toLowerCase().includes("client")) parsed.clients = json;;
      if (sheetName.toLowerCase().includes("worker")) parsed.workers = json;
      if (sheetName.toLowerCase().includes("task")) parsed.tasks = json;
      }
    }

    onClientsParsed(parsed.clients);
    onWorkersParsed(parsed.workers);
    onTasksParsed(parsed.tasks);

    const validationErrors = validateData(parsed);
    onValidation(validationErrors);
  };

  const validateData = (parsed: any) => {
    const errors: Record<string, string[]> = {
      clients: [],
      workers: [],
      tasks: [],
    };
  
    const { clients, workers, tasks } = parsed;
  

    if (!clients[0]?.ClientID) errors.clients.push("Missing ClientID in clients sheet");
    if (!workers[0]?.WorkerID) errors.workers.push("Missing WorkerID in workers sheet");
    if (!tasks[0]?.TaskID) errors.tasks.push("Missing TaskID in tasks sheet");
    

    const hasDuplicates = (arr: any[], key: string) =>
      new Set(arr.map((x) => x[key])).size !== arr.length;
    
    if (hasDuplicates(clients, "ClientID")) errors.clients.push("Duplicate ClientIDs found");
    if (hasDuplicates(workers, "WorkerID")) errors.workers.push("Duplicate WorkerIDs found");
    if (hasDuplicates(tasks, "TaskID")) errors.tasks.push("Duplicate TaskIDs found");

    tasks.forEach((t:ITask, i:number) => {
        if (typeof t.Duration !== "number" || t.Duration < 1) {
            errors.tasks.push(`Invalid Duration at row ${i + 2}`);
        }
        try {
            if (t.PreferredPhases && typeof t.PreferredPhases === "string") {
                const val = JSON.parse(t.PreferredPhases);
                if (!Array.isArray(val)) throw new Error();
            }
        } catch {
            errors.tasks.push(`Malformed PreferredPhases at row ${i + 2}`);
        }
    });
 
    clients.forEach((c:IClient, i:number) => {
        const level = parseInt(c.PriorityLevel);
        if (isNaN(level) || level < 1 || level > 5) {
            errors.clients.push(`PriorityLevel out of range at client row ${i + 2}`);
        }
    });
    
 
    clients.forEach((c:IClient, i:number) => {
        if (c.AttributesJSON) {
            try {
                JSON.parse(c.AttributesJSON);
            } catch {
                errors.clients.push(`Invalid JSON in AttributesJSON at client row ${i+1}`);
            }
        }
    });

    

    const taskIds = new Set(tasks.map((t:ITask) => t.TaskID));
    clients.forEach((c:IClient, i:number) => {
        const ids = c.RequestedTaskIDs?.split?.(",") || [];
        ids.forEach((id: string) => {
            if (!taskIds.has(id.trim())) {
                errors.clients.push(`Unknown TaskID '${id}' in RequestedTaskIDs at client row ${i + 2}`);
            }
      });
    });
   
    workers.forEach((w:IWorker, i:number) => {
        let slots:string|[] = w.AvailableSlots;
        if (typeof slots === "string") {
          try {
            slots = JSON.parse(slots);
          } catch {
            slots = [];
          }
        }
        if (Array.isArray(slots) && parseInt(w.MaxLoadPerPhase) > slots.length) {
          errors.workers.push(
            `WorkerID ${w.WorkerID} overloaded: MaxLoadPerPhase exceeds available slots at row ${i + 2}`
          );
        }
      });
  
    
      const phaseUsage: Record<string, number> = {};
      const workerCapacity: Record<string, number> = {};
  
      workers.forEach((w:IWorker) => {
        let slots: number[] = [];
        try {
          slots = JSON.parse(w.AvailableSlots);
        } catch {
          return;
        }
        slots.forEach((p) => {
          workerCapacity[p] = (workerCapacity[p] || 0) + 1;
        });
      });
  
      tasks.forEach((t:ITask) => {
        let phases: number[] = [];
        try {
          phases = Array.isArray(t.PreferredPhases)
            ? t.PreferredPhases
            : JSON.parse(t.PreferredPhases);
        } catch {
          return;
        }
        phases.forEach((p: number) => {
          phaseUsage[p] = (phaseUsage[p] || 0) + (t.Duration || 1);
        });
      });
  
      Object.entries(phaseUsage).forEach(([phase, load]) => {
        if (load > (workerCapacity[phase] || 0)) {
          errors.tasks.push(`Phase ${phase} overloaded: ${load} > available slots (${workerCapacity[phase] || 0})`);
        }
      });
    
   
    const allWorkerSkills = new Set(
        workers.flatMap((w:IWorker) => w.Skills?.split?.(",")?.map((s: string) => s.trim()) || [])
    );
    tasks.forEach((t:ITask, i:number) => {
        const missing = (t.RequiredSkills?.split?.(",") || []).filter(
            (s: string) => !allWorkerSkills.has(s.trim())
        );
        if (missing.length > 0) {
            errors.tasks.push(`Unmatched RequiredSkills (${missing.join(", ")}) at task row ${i + 2}`);
        }
    });
   
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v.length > 0)
    );
    console.log(filteredErrors)
    return filteredErrors;
  };

return (
    <div className="space-y-2 bg-gray-100 p-6 rounded border cursor-pointer">
      <input
        type="file"
        multiple
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="file-input text-gray-600 cursor-pointer"
        />
      <p className="text-sm text-gray-500 cursor-pointer">Upload clients, workers, and tasks files</p>
    </div>
  );
}
