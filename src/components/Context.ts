export let context =`
Data Entity Explanation:
clients.""
ClientID, ClientName, PriorityLevel, RequestedTaskIDs, GroupTag, AttributesJSON
PriorityLevel: integer (1–5)
RequestedTaskIDs: comma-separated TaskIDs
AttributesJSON: arbitrary JSON metadata
workers.""
WorkerID, WorkerName, Skills, AvailableSlots, MaxLoadPerPhase,
WorkerGroup, QualificationLevel
Skills: comma-separated tags
AvailableSlots: array of phase numbers (e.g. [1,3,5])
MaxLoadPerPhase: integer
tasks.""
TaskID, TaskName, Category, Duration, RequiredSkills, 
PreferredPhases, MaxConcurrent
Duration: number of phases (≥1)
RequiredSkills: comma-separated tags
PreferredPhases: list or range syntax (e.g. "1-3" or [2,4,5])
MaxConcurrent: integer (max parallel assignments)
Entity Explanation
Clients represent the people or groups requesting work. They provide RequestedTaskIDs and a PriorityLevel to indicate importance. Your ingestion must check that every requested task exists and that higher-priority clients can be identified.
Tasks define units of work. Each task has a Duration, required skills, preferred phases, and concurrency limits. You must ensure durations are valid, skill tags match worker capabilities, and preferred phases are parsed and normalized.
Workers supply the capacity to perform tasks. Workers list their Skills, AvailableSlots (phases they can work), and MaxLoadPerPhase. You must verify skills cover tasks, slots are valid numbers, and load limits are enforceable.
Data Relationships & Correlations
To help you understand why each validation is important, here’s how the core datasets connect:
Clients → Tasks: Each RequestedTaskIDs entry for a client must match valid TaskIDs in tasks."". This ensures clients only request existing tasks.
Tasks → Workers: Every skill listed in a task’s RequiredSkills must appear in at least one worker’s Skills. Without this, no one can perform the task.
Workers → Phases: AvailableSlots define which phases a worker can serve. Phase-window and slot-restriction rules rely on these mappings.
Group Tags: GroupTag in clients and WorkerGroup in workers link to slot-restriction and load-limit rules for grouped operations.
PriorityLevel Impact: A client’s PriorityLevel (1–5) signals which requests should be satisfied first during allocation. Some validations compare priority levels across clients.
PreferredPhases: Tasks may specify ranges (e.g. "2-4") or lists ([1,3,5]); these values guide phase-window constraints and must be normalized to explicit phase arrays.
Understanding these connections will guide your implementation of cross-reference validations and help you anticipate complex checks like circular co-runs or phase-slot saturation.
NOTE: You don’t rely completely on the sample data shared by us, be innovative and come up with your own sample data and edge cases.
`