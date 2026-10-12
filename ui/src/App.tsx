import { useEffect, useState, type ReactNode } from "react";

type IconProps = {
  children: ReactNode;
  className?: string;
  viewBox?: string;
};

function Icon({ children, className = "size-5", viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox={viewBox}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const IconGrid = () => (
  <Icon><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></Icon>
);
const IconClaims = () => (
  <Icon><path d="M7 3.5h8l3 3V20H7z" /><path d="M15 3.5V7h3M10 11h5M10 15h5" /><path d="M4 7v13h10" /></Icon>
);
const IconPeople = () => (
  <Icon><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3.1 2.4-5 5.5-5s4.9 1.9 5.5 5M15 5.5a3 3 0 0 1 0 5.5M16 14c2.5.2 4 1.9 4.5 4.5" /></Icon>
);
const IconChart = () => (
  <Icon><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></Icon>
);
const IconSettings = () => (
  <Icon><circle cx="12" cy="12" r="3" /><path d="M19.2 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.6 2.6-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.4 7 7 4.4l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4h-.2a1.7 1.7 0 0 0-1.6 1Z" /></Icon>
);
const IconSearch = () => <Icon><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></Icon>;
const IconBell = () => <Icon><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 20h4" /></Icon>;
const IconChevron = () => <Icon className="size-4"><path d="m9 18 6-6-6-6" /></Icon>;
const IconArrow = () => <Icon className="size-4"><path d="M5 12h14M14 7l5 5-5 5" /></Icon>;
const IconSpark = () => <Icon className="size-4"><path d="m12 3 1.4 4.1L17.5 8l-4.1 1.4L12 13.5l-1.4-4.1L6.5 8l4.1-.9zM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></Icon>;
const IconCheck = () => <Icon className="size-4"><path d="m5 12 4 4 10-10" /></Icon>;

type Claim = {
  intake: {
    claim_core: {
      claim_id: string;
      date: string;
      billed_amount: number;
      allowed_amount: number;
      par_flag: boolean;
      provider_id: string;
      client_id: string;
    };
    claim_pend_instances: Array<{
      pend_instance_id: string;
      pend_date: string;
      pend_reason_code: string;
      pend_status: string;
    }>;
  };
  priority_score: number;
  required_skills: string[];
  status: string;
  assigned_operator_id?: string;
};

type Operator = {
  operator_id: string;
  first_name: string;
  last_name: string;
  tier_level: number;
  max_daily_capacity: number;
  skills: Array<{
    skill_type: string;
    dollar_signoff_limit: number;
  }>;
  assigned_claims?: string[];
};

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-9 items-end justify-center text-emerald-500">
        <svg aria-hidden="true" viewBox="0 0 40 40" className="size-9 fill-current">
          <path d="M19.1 34.5c.4-8.8 4-15.9 11.5-21.4-3.4 1-6.4 2.6-8.7 4.8.3-6-1.8-10.7-6.3-14.3 1.8 4.9 2.3 9.6 1.3 14.3-2.7-2.6-6.3-4.1-10.7-4.4 5.3 3.5 8.7 8.5 10.1 14.8-4.1-3.1-8.7-4.5-13.9-4.2 6.2 2.4 11 5.8 14.4 10.4h2.3Z" />
        </svg>
      </div>
      <div>
        <div className="text-2xl font-extrabold leading-none tracking-tight text-white">Cigna</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">Claim Intelligence</div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-white/12 text-white" : "text-blue-100 hover:bg-white/8 hover:text-white"}`}>
      <span className={active ? "text-emerald-400" : "text-blue-300"}>{icon}</span>
      <span>{label}</span>
      {badge && <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{badge}</span>}
    </button>
  );
}

function ClaimCard({ claim, active, onSelect }: { claim: Claim; active: boolean; onSelect: () => void }) {
  const core = claim.intake.claim_core;
  const isAssigned = claim.status === "ASSIGNED" || Boolean(claim.assigned_operator_id);

  return (
    <button
      onClick={onSelect}
      className={`relative w-full overflow-hidden rounded-xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-blue-300 shadow-[0_6px_22px_rgba(12,74,140,0.12)] ring-2 ring-blue-100" : "border-slate-200 shadow-sm"}`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-blue-600" />
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {core.client_id ? core.client_id.slice(4, 6) : "CI"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{core.claim_id}</span>
                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold ${claim.priority_score >= 80 ? "bg-rose-600 text-white" : claim.priority_score >= 50 ? "bg-orange-500 text-white" : "bg-amber-400 text-amber-950"}`}>
                  <span className="font-semibold opacity-80">Score</span> {claim.priority_score}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Client: {core.client_id} · Provider: {core.provider_id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">${core.billed_amount?.toLocaleString()}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{core.date}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {claim.required_skills?.map((skill) => (
              <span key={skill} className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">{skill}</span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-400">{isAssigned ? "Assigned by rules engine" : "Evaluating matches"}</span>
            {isAssigned ? (
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />Op ID: {claim.assigned_operator_id}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-bold text-amber-600">
                <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />Pending match
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function OperatorRow({ operator }: { operator: Operator }) {
  const activeCount = operator.assigned_claims?.length || 0;
  const load = (activeCount / operator.max_daily_capacity) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
          {operator.first_name?.[0]}{operator.last_name?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-900">{operator.first_name} {operator.last_name}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Tier {operator.tier_level} Specialist ({operator.operator_id})</p>
            </div>
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />Active
            </span>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-500">
              <span>{activeCount} assigned claims</span>
              <span>Max capacity: {operator.max_daily_capacity}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${load >= 100 ? "bg-slate-400" : load >= 70 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${load}%` }} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {operator.skills?.map((s) => (
              <span key={s.skill_type} className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                {s.skill_type} (${s.dollar_signoff_limit?.toLocaleString()})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<string>("");

  const [filter, setFilter] = useState("All claims");
  const [queueTab, setQueueTab] = useState<"pending" | "assigned">("pending");
  const [refreshCount, setRefreshCount] = useState(0);
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);

  // Fetch live backend data on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/claims")
      .then((res) => res.json())
      .then((data) => {
        setClaims(data);
        if (data.length > 0) setSelectedClaim(data[0].intake.claim_core.claim_id);
      })
      .catch((err) => console.error("Error fetching claims:", err));

    fetch("http://127.0.0.1:8000/operators")
      .then((res) => res.json())
      .then((data) => setOperators(data))
      .catch((err) => console.error("Error fetching operators:", err));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsSinceRefresh((current) => {
        if (current >= 5) {
          setRefreshCount((count) => count + 1);
          return 0;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const claimsForTab = claims.filter((claim) => {
    const isAssigned = claim.status === "ASSIGNED" || Boolean(claim.assigned_operator_id);
    return queueTab === "assigned" ? isAssigned : !isAssigned;
  });

const needsAssignmentCount = claims.filter(
  (claim) =>
    claim.status !== "ASSIGNED" && !claim.assigned_operator_id
).length;

const successfullyAssignedCount = claims.filter(
  (claim) =>
    claim.status === "ASSIGNED" || Boolean(claim.assigned_operator_id)
).length;

  const visibleClaims = filter === "All claims"
    ? claimsForTab
    : claimsForTab.filter((claim) => claim.intake.claim_core.client_id?.includes(filter));

  useEffect(() => {
    if (claimsForTab.length > 0 && !claimsForTab.some((claim) => claim.intake.claim_core.claim_id === selectedClaim)) {
      setSelectedClaim(claimsForTab[0].intake.claim_core.claim_id);
    }
  }, [claimsForTab, selectedClaim]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-brand p-5 lg:flex">
        <Brand />
        <div className="mt-9">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">Workspace</p>
          <nav className="space-y-1">
            <NavItem icon={<IconGrid />} label="Overview" />
            <NavItem icon={<IconClaims />} label="Claim triage" active badge={claims.length.toString()} />
            <NavItem icon={<IconPeople />} label="Operators" />
            <NavItem icon={<IconChart />} label="Analytics" />
          </nav>
        </div>
        <div className="mt-auto">
          <div className="mb-5 rounded-xl border border-white/10 bg-white/6 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white">
              <span className="flex size-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300"><IconSpark /></span>
              AI triage online
            </div>
            <p className="text-[11px] leading-relaxed text-blue-200">FastAPI backend connected live.</p>
          </div>
          <NavItem icon={<IconSettings />} label="Settings" />
          <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-5">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-400 text-xs font-extrabold text-blue-950">JM</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">Jordan Mitchell</p>
              <p className="truncate text-[10px] text-blue-300">Triage lead</p>
            </div>
            <IconChevron />
          </div>
        </div>
      </aside> */}

      {/* <main className="lg:ml-60"> */}
      <main className="min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7">
          {/* <div className="lg:hidden"><Brand /></div> */}
          <div className="ml-auto flex items-center gap-2">
            <label className="relative hidden sm:block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"><IconSearch /></span>
              <input className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="Search claims" />
            </label>
            <button aria-label="Notifications" className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
              <IconBell />
              <span className="absolute right-2 top-1.5 size-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-screen-2xl p-4 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Live queue</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Refreshed {secondsSinceRefresh}s ago</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Claims triage</h1>
              <p className="mt-1 text-sm text-slate-500">Prioritize high-impact claims and view live operator workloads.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-extrabold leading-none text-slate-950">{claims.length}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Claims</p>
              </div>
            </div>
          </div>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
            <div className="min-w-0">
              <div className="mb-4 flex items-center gap-6 border-b border-slate-200">
                <button
                  onClick={() => setQueueTab("pending")}
                  className={`relative pb-3 text-sm font-bold transition ${queueTab === "pending" ? "text-blue-700" : "text-slate-400 hover:text-slate-700"}`}
                >
                  Needs assignment ({needsAssignmentCount})
                  {queueTab === "pending" && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-700" />}
                </button>
                <button
                  onClick={() => setQueueTab("assigned")}
                  className={`relative pb-3 text-sm font-bold transition ${queueTab === "assigned" ? "text-emerald-700" : "text-slate-400 hover:text-slate-700"}`}
                >
                  Successfully assigned ({successfullyAssignedCount})
                  {queueTab === "assigned" && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-emerald-600" />}
                </button>
              </div>
              
              <div className="space-y-3">
                {visibleClaims.map((claim) => (
                  <ClaimCard
                    key={claim.intake.claim_core.claim_id}
                    claim={claim}
                    active={selectedClaim === claim.intake.claim_core.claim_id}
                    onSelect={() => setSelectedClaim(claim.intake.claim_core.claim_id)}
                  />
                ))}
                {visibleClaims.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck /></div>
                    <p className="mt-3 text-sm font-bold text-slate-800">No claims found in this view</p>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-slate-700">Operator skill matching</p>
                  <span className="text-[10px] font-semibold text-slate-400">Live DB</span>
                </div>
                <div className="space-y-3">
                  {operators.map((operator) => (
                    <OperatorRow
                      key={operator.operator_id}
                      operator={operator}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}