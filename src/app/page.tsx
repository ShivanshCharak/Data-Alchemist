"use client";
import { useState, useEffect } from "react";
import { Upload } from "@/components/Upload";
import { DataGrid } from "@/components/DataGrid";
import { ValidationPanel } from "@/components/ValidationPanel";
import { NLQueryBar } from "@/components/NlQueryBar";
import { NLModifyBar } from "@/components/NlModifyBar";
import { AIValidatorPanel } from "@/components/AiValidator";
import { RuleDashboard } from "@/components/RuleDashboard";
import { ITask,IClient,IWorker,ValidationErrors } from "@/types/sheets";
import { RuleRecommendationPanel } from "@/components/RuleRecommendationPanel";
import { AIErrorCorrectionPanel } from "@/components/AiErrorCorrectionPanel";


// export type Client = {
//   ClientID: string;
//   ClientName: string;
//   PriorityLevel: string;
//   RequestedTaskIDs: string;
//   GroupTag: string;
//   AttributesJSON: string;
// };

// type Worker = {
//   WorkerID: string;
//   WorkerName: string;
//   Skills: string;
//   AvailableSlots: string;
//   MaxLoadPerPhase: string;
//   WorkerGroup: string;
//   QualificationLevel: string;
// };

// type Task = {
//   TaskID: string;
//   TaskName: string;
//   Category: string;
//   Duration: string;
//   RequiredSkills: string;
//   PreferredPhases: string;
//   MaxConcurrent: string;
// };


export type AnyData = IClient[] | IWorker[] | ITask[];

export default function Home() {
  const [clientData, setClientData] = useState<IClient[]>([]);
  const [workerData, setWorkerData] = useState<IWorker[]>([]);
  const [taskData, setTaskData] = useState<ITask[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [filteredTaskData, setFilteredTaskData] = useState<ITask[] | null>(null);
  const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'tasks'>('clients');
  const [modifiedClients, setModifiedClients] = useState<IClient[] | null>(null);
  const [modifiedWorkers, setModifiedWorkers] = useState<IWorker[] | null>(null);

  useEffect(() => {
    // Any side effects can be added here
  }, [taskData, filteredTaskData]);

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">🧪 Data Alchemist</h1>
          <Upload
            onClientsParsed={setClientData}
            onWorkersParsed={setWorkerData}
            onTasksParsed={setTaskData}
            onValidation={setValidationErrors}
          />
        </header>

        <div className="fixed right-4 top-4 flex flex-col gap-4 z-50">
          {Object.keys(validationErrors).length > 0 && (
            <ValidationPanel errors={validationErrors} className="transform translate-y-0" />
          )}

          <NLModifyBar
            originalData={
              activeTab === 'clients'
                ? clientData
                : activeTab === 'workers'
                ? workerData
                : taskData
            }
            onModified={(newData:AnyData) => {
              setFilteredTaskData(null);

              if (activeTab === 'clients') {
                setModifiedClients(newData as IClient[]);
              } else if (activeTab === 'workers') {
                setModifiedWorkers(newData as IWorker[]);
              } else {
                const updated = taskData.map(task => {
                  const modified = (newData as ITask[]).find((m:ITask) => m.TaskID === task.TaskID);
                  return modified ? { ...task, ...modified } : task;
                });
                setTaskData(updated);
              }
            }}
          />

          {taskData.length > 0 && (
            <NLQueryBar
              originalData={taskData}
              onFilteredData={setFilteredTaskData}
              className="transform translate-y-[100px]"
            />
          )}
        </div>

        {(clientData.length > 0 || workerData.length > 0 || taskData.length > 0) ? (
          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b">
              {clientData.length > 0 && (
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`px-6 py-3 cursor-pointer font-medium ${activeTab === 'clients' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Clients
                </button>
              )}
              {workerData.length > 0 && (
                <button
                  onClick={() => setActiveTab('workers')}
                  className={`px-6 py-3 cursor-pointer font-medium ${activeTab === 'workers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Workers
                </button>
              )}
              {taskData.length > 0 && (
                <button
                  onClick={() => {
                    setFilteredTaskData(null);
                    setActiveTab('tasks');
                  }}
                  className={`px-6 py-3 cursor-pointer font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Tasks
                </button>
              )}
            </div>

            <div className="p-4">
              {activeTab === 'clients' && clientData.length > 0 && (
                <DataGrid
                  data={modifiedClients ?? clientData}
                  setData={setClientData}
                  label="Clients"
                />
              )}

              {activeTab === 'workers' && workerData.length > 0 && (
                <DataGrid
                  data={modifiedWorkers ?? workerData}
                  setData={setWorkerData}
                  label="Workers"
                />
              )}

              {activeTab === 'tasks' && taskData.length > 0 && (
                <DataGrid
                  data={filteredTaskData ?? taskData}
                  setData={setTaskData}
                  label="Tasks"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Upload your data files to begin</p>
          </div>
        )}

        {clientData.length > 0 && workerData.length > 0 && taskData.length > 0 && (
          <RuleDashboard
            data={{
              clients: clientData,
              workers: workerData,
              tasks: taskData,
            }}
          />
        )}

        {clientData.length > 0 && workerData.length > 0 && taskData.length > 0 && (
          <RuleRecommendationPanel
            allData={{ clients: clientData, workers: workerData, tasks: taskData }}
          />
        )}

        <AIErrorCorrectionPanel
        
            clients= {clientData}
            workers= {workerData}
            tasks= {taskData}
          
        />
        
        <AIValidatorPanel
       
            clients= {clientData}
            workers= {workerData}
            tasks= {taskData}
          
        />
      </div>
    </main>
  );
}