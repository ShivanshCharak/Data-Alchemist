
"use client";

import {  IPriority, IRules} from "@/types/sheets";

export function ExportPanel({
  rules,
  priorities,
}: {
  
  rules: IRules[];
  priorities?: IPriority;
}) {
  const exportData = () => {
    const bundle = {
      rules,
      priorities,
    };
    const jsonStr = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rules.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    // <div className="p-4 border rounded-xl text-gray-800">
    //   <h2 className="text-lg font-bold">Export Panel</h2>

      <button onClick={exportData} className=" cursor-pointer  bg-green-600 text-white px-4 py-4 rounded absolute bottom-10 right-10">
        📤 Download rules.json
      </button>
    // </div>
  );
}
