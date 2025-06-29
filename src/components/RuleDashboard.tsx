
"use client";

import { useState } from "react";
import { RuleBuilder } from "./RuleBuilder";
import { PrioritizationPanel } from "./Prioritization";
import { NaturalRuleInput } from "./NaturalRuleInput";
import { ExportPanel } from "./ExportPanel";
import { IClient, IPriority, IRules, ITask, IWorker } from "@/types/sheets";

export function RuleDashboard({ data }: { data: { clients: IClient[]; workers: IWorker[]; tasks: ITask[] } }) {
  const [rules, setRules] = useState<IRules[]>([]);
  const [priorities, setPriorities] = useState<IPriority>();
  console.log("rules",rules,priorities)

  const handleAIParsedRule = (aiRule: IRules) => {
    setRules((prev) => [...prev, aiRule]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        <RuleBuilder onRulesChange={setRules} />
        <NaturalRuleInput onAIParsedRule={handleAIParsedRule} originalData={data} />
      </div>

      <div className="space-y-4">
        <PrioritizationPanel onPrioritiesChange={setPriorities} />
        <ExportPanel rules={rules} priorities={priorities} />
      
      </div>
    </div>
  );
}
