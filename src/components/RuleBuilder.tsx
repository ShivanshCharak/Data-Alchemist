"use client";
import { useState } from "react";
import { IRules, RuleType } from "@/types/sheets";


export function RuleBuilder({ onRulesChange }: { onRulesChange: (rules:IRules[]) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rules, setRules] = useState<IRules[]>([]);
  const [type, setType] = useState<RuleType>("coRun");
  const [input, setInput] = useState("");
  

  
  const addRule = () => {
    let rule: IRules;
  
    if (type === "coRun") {
      rule = {
        type,
        tasks: input.split(",").map((x) => x.trim()),
        maxConcurrent: 2,
        minConcurrent: 1,
      };
    } else if (type === "slotRestriction") {
      rule = {
        type,
        group: input,
        minCommonSlots: 2,
      };
    } else if (type === "loadLimit") {
      rule = {
        type,
        group: input,
        maxLoad: input === "GroupA" ? 10 : input === "GroupB" ? 8 : 12,
      };
    } else if (type === "phaseWindow") {
      const [task, phases] = input.split(":");
      rule = {
        type,
        task: task.trim(),
        allowedPhases: phases.split(",").map((p) => parseInt(p.trim())),
      };
    } else if (type === "patternMatch") {
      const [regex, template, params] = input.split(":");
      rule = {
        type,
        regex: regex.trim(),
        template: template.trim(),
        parameters: params.split(",").map((p) => p.trim()),
      };
    } else if (type === "precedenceOverride") {
      rule = {
        type,
        priorityOrder: input.split(",").map((r) => r.trim()),
      };
    } else {
      return;
    }
  
    const updated = [...rules, rule];
    setRules(updated);
    onRulesChange(updated);
    setInput("");
  };
  
  return (
    <div className={`
      fixed right-0 top-[160px] -translate-y-1/2
      flex items-stretch
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-96' : 'w-16'}
      h-64
      bg-blue-50/90 backdrop-blur-sm
      border-l-2 border-blue-200
      rounded-l-lg overflow-hidden
      shadow-lg hover:shadow-xl
      z-40
    `}>
   
      <div 
        className="
          w-16 flex-shrink-0
          bg-blue-100 hover:bg-blue-200
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
          text-blue-800
          select-none
        ">
          {rules.length} {rules.length === 1 ? 'Rule' : 'Rules'}
        </span>
      </div>

      {/* Collapsible content area */}
      <div className={`
        flex-1 p-4
        transition-opacity duration-200
        ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}
        overflow-y-auto
      `}>
        <div className="min-w-[300px] space-y-3">
          <h3 className="
            font-bold text-lg
            text-blue-900
            mb-3 pb-2
            border-b border-blue-200
          ">
            Rule Builder
          </h3>
          
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as RuleType)} 
            className="border px-2 py-1 w-full rounded "
          >
            <option value="coRun">Co-Run</option>
            <option value="slotRestriction">Slot Restriction</option>
            <option value="loadLimit">Load Limit</option>
            <option value="phaseWindow">Phase Window</option>
            <option value="patternMatch">Pattern Match</option>
            <option value="precedenceOverride">Precedence Override</option>

          </select>
          
          <input
            type="text"
            placeholder="Enter input (T1,T2 or Group1 or T5:[1,2])"
            className="border px-2 py-1 w-full rounded text-gray-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <button 
            onClick={addRule} 
            className="bg-blue-600 text-white px-4 py-1 rounded w-full hover:bg-blue-700 transition-colors"
          >
            ➕ Add Rule
          </button>
          
          <div className="bg-blue-50 p-2 rounded max-h-32 overflow-y-auto">
  <pre className="text-xs text-blue-800">
    {JSON.stringify(rules, null, 2)
      .replace(/\\/g, '')
      .replace(/"\[/g, '[')
      .replace(/\]"/g, ']')
      .replace(/"\{/g, '{')
      .replace(/\}"/g, '}')}
  </pre>
</div>
        </div>
      </div>
    </div>
  );
}