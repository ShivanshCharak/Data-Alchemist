
// "use client";

// import { useEffect, useState } from "react";
// import { context } from "./Context";

// export function AIRuleHints({ contextData, onRuleAccepted }: any) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [hints, setHints] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isExpanded || hints.length > 0) return;
//     setLoading(true);
//     fetch("/api/rule-hints", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contextData, context }),
//     })
//       .then((res) => res.json())
//       .then((data) => setHints(data.hints || []))
//       .catch(() => alert("Failed to fetch rule hints"))
//       .finally(() => setLoading(false));
//   }, [isExpanded]);

//   return (
//     <div className={`fixed right-0 top-[16rem] flex items-stretch ${isExpanded ? 'w-96' : 'w-16'} h-64 bg-purple-50/90 backdrop-blur-sm border-l-2 border-purple-200 rounded-l-lg shadow-lg z-10 transition-all duration-300`}>
//       <div className="w-16 bg-purple-100 hover:bg-purple-200 flex items-center justify-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
//         <span className="font-bold text-xl -rotate-90 text-purple-800 select-none">Hints</span>
//       </div>
//       <div className={`flex-1 p-4 overflow-y-auto ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'} transition-opacity`}>
//         <h3 className="font-bold text-lg text-purple-900 mb-2">📡 Rule Suggestions</h3>
//         {loading && <p className="text-sm text-purple-600 animate-pulse">🔍 Scanning patterns...</p>}
//         <ul className="space-y-2">
//           {hints.map((hint, i) => (
//             <li key={i} className="text-sm text-purple-800 bg-purple-100 rounded p-2 flex justify-between items-center">
//               <span>{hint}</span>
//               <button
//                 onClick={() => onRuleAccepted(hint)}
//                 className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
//               >
//                 Accept
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
