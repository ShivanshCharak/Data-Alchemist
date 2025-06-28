
"use client";

import { useState } from "react";
import { RuleBuilder } from "./RuleBuilder";
import { PrioritizationPanel } from "./Prioritization";
import { NaturalRuleInput } from "./NaturalRuleInput";
import { ExportPanel } from "./ExportPanel";

export function RuleDashboard({ data }: { data: { clients: any[]; workers: any[]; tasks: any[] } }) {
  const [rules, setRules] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any>({});

  const handleAIParsedRule = (aiRule: any) => {
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
        <ExportPanel data={data} rules={rules} priorities={priorities} />
      
      </div>
    </div>
  );
}
