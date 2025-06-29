export interface IClient {
    ClientID: string,
    CleintName: string,
    PriorityLevel: string
    RequestedTaskIDs: string,
    AttributesJSON: string,
    GroupTag: string
}
export interface ITask {
    Category: string,
    Duration: number,
    MaxConcurrent: number;
    PreferredPhases: string;
    RequiredSkills: string;
    TaskID: string;
    TaskName: string;
}

export interface IWorker {
    AvailableSlots: string;
    MaxLoadPerPhase: string;
    QualificationLevel: number;
    Skills: string;
    WorkerGroup: string;
    WorkerID: string;
    WorkerName: string
}
export interface IHints {
    rowIndex: number,
    field: string,
    error: string
}

export type IRules =
  | {
      type: "coRun";
      tasks: string[];
      maxConcurrent: number;
      minConcurrent: number;
    }
  | {
      type: "slotRestriction";
      group: string;
      minCommonSlots: number;
    }
  | {
      type: "loadLimit";
      group: string;
      maxLoad: number;
    }
  | {
      type: "phaseWindow";
      task: string;
      allowedPhases: number[];
    }
  | {
      type: "patternMatch";
      regex: string;
      template: string;
      parameters: string[];
    }
  | {
      type: "precedenceOverride";
      priorityOrder: string[];
    };


export interface IPriority {
    fairness: number
    fulfillment: number
    loadBalance: number
    priorityLevel: number

}
export type RuleType =
  | "coRun"
  | "slotRestriction"
  | "loadLimit"
  | "phaseWindow"
  | "patternMatch"
  | "precedenceOverride";

  export type ValidationErrors = {
    clients?: string[];
    workers?: string[];
    tasks?: string[];
    crossEntity?: string[];
  };

  export type RuleJson = {
    coRun?: Record<string, string[]>;
    loadLimits?: Record<string, number>;
    phaseWindowConstraints?: Record<string, number[]>;
    skillConstraints?: Record<string, string[]>;
    taskDuration?: Record<string, string[]>;

  };

  export type INLQuery={
    TaskID: string,
    TaskName: string,
    Category: string,
    Duration: number,
    RequiredSkills: string,
    PreferredPhases: string,
    MaxConcurrent: number
  }
  