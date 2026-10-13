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

const IconSliders = () => (
  <Icon className="size-4">
    <path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h8M16 18h4" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="14" cy="18" r="2" />
  </Icon>
);

const IconX = () => (
  <Icon className="size-5">
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

type PriorityWeights = {
  financial: number;
  aging: number;
  strategic: number;
  efficiency: number;
};

const defaultWeights: PriorityWeights = {
  financial: 35,
  aging: 30,
  strategic: 20,
  efficiency: 15,
};

function rebalanceWeights(
  current: PriorityWeights,
  changedKey: keyof PriorityWeights,
  nextValue: number,
): PriorityWeights {
  const value = Math.max(0, Math.min(100, Math.round(nextValue)));

  const otherKeys = (
    Object.keys(current) as Array<keyof PriorityWeights>
  ).filter((key) => key !== changedKey);

  const remaining = 100 - value;
  const otherTotal = otherKeys.reduce(
    (total, key) => total + current[key],
    0,
  );

  const next = { ...current, [changedKey]: value };
  let allocated = 0;

  otherKeys.forEach((key, index) => {
    const isLast = index === otherKeys.length - 1;

    const adjusted = isLast
      ? remaining - allocated
      : Math.floor(
        remaining *
        (otherTotal === 0
          ? 1 / otherKeys.length
          : current[key] / otherTotal),
      );

    next[key] = adjusted;
    allocated += adjusted;
  });

  return next;
}

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
  manual_override?: boolean;
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
            <span className="font-semibold text-slate-400">
              {claim.manual_override
                ? "Manually assigned"
                : isAssigned
                  ? "Assigned by rules engine"
                  : "Evaluating matches"}
            </span>
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
  const [queueTab, setQueueTab] = useState<"pending" | "assigned" | "all">("pending");
  const [refreshCount, setRefreshCount] = useState(0);
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [managerClaimId, setManagerClaimId] = useState("");

  const [showPrioritySettings, setShowPrioritySettings] = useState(false);

  const [priorityWeights, setPriorityWeights] =
    useState<PriorityWeights>(defaultWeights);

  const [loadingWeights, setLoadingWeights] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);
  const [priorityError, setPriorityError] = useState("");
  const [priorityMessage, setPriorityMessage] = useState("");

  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");

  async function openPrioritySettings() {
    setShowPrioritySettings(true);
    setLoadingWeights(true);
    setPriorityError("");
    setPriorityMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/priority-model",
      );

      if (!response.ok) {
        throw new Error("Could not load priority weights.");
      }

      const data: PriorityWeights = await response.json();

      const total = Object.values(data).reduce(
        (sum, weight) => sum + weight,
        0,
      );

      if (
        Object.values(data).some(
          (weight) => !Number.isFinite(weight) || weight < 0,
        ) ||
        Math.abs(total - 100) > 1e-9
      ) {
        throw new Error("The backend returned invalid priority weights.");
      }

      setPriorityWeights(data);
    } catch (error) {
      setPriorityError(
        error instanceof Error
          ? error.message
          : "Could not load priority settings.",
      );
    } finally {
      setLoadingWeights(false);
    }
  }

  async function refreshDashboardData() {
    const [claimsResponse, operatorsResponse] = await Promise.all([
      fetch("http://127.0.0.1:8000/claims"),
      fetch("http://127.0.0.1:8000/operators"),
    ]);

    if (!claimsResponse.ok || !operatorsResponse.ok) {
      throw new Error("Dashboard refresh failed.");
    }

    const [updatedClaims, updatedOperators] = await Promise.all([
      claimsResponse.json(),
      operatorsResponse.json(),
    ]);

    setClaims(updatedClaims);
    setOperators(updatedOperators);
  }

  async function saveAssignment(claimId: string, operatorId: string) {
    setAssignmentSaving(true);
    setAssignmentError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/claims/${encodeURIComponent(claimId)}/assignment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operator_id: operatorId }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Could not save assignment.");
      }

      await refreshDashboardData();
    } catch (error) {
      setAssignmentError(
        error instanceof Error ? error.message : "Could not save assignment.",
      );
    } finally {
      setAssignmentSaving(false);
    }
  }

  async function savePrioritySettings() {
    const total = Object.values(priorityWeights).reduce(
      (sum, weight) => sum + weight,
      0,
    );

    if (Math.abs(total - 100) > 1e-9) {
      setPriorityError("Priority weights must add up to 100%.");
      return;
    }

    setSavingWeights(true);
    setPriorityError("");
    setPriorityMessage("");

    let weightsSaved = false;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/priority-model",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(priorityWeights),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Could not save priority weights.",
        );
      }

      weightsSaved = true;

      await refreshDashboardData();

      setPriorityMessage("Priority model saved and claim scores updated.");
      setShowPrioritySettings(false);
    } catch (error) {
      setPriorityError(
        error instanceof Error
          ? error.message
          : weightsSaved
            ? "Weights were saved, but refreshing the dashboard failed."
            : "Could not save priority settings.",
      );
    } finally {
      setSavingWeights(false);
    }
  }

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
    const isAssigned =
      claim.status === "ASSIGNED" ||
      Boolean(claim.assigned_operator_id);

    if (queueTab === "all") return true;
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


  const getClaimId = (claim: Claim) => claim.intake.claim_core.claim_id;

  const managerClaim = claims.find((claim) => getClaimId(claim) === managerClaimId);
  const managerAssignedId = managerClaim?.assigned_operator_id ?? null;

  useEffect(() => {
    if (claimsForTab.length > 0 && !claimsForTab.some((claim) => claim.intake.claim_core.claim_id === selectedClaim)) {
      setSelectedClaim(claimsForTab[0].intake.claim_core.claim_id);
    }
  }, [claimsForTab, selectedClaim]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <main className="min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-7">
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
                {/* New All Claims tab */}
                <button
                  onClick={() => setQueueTab("all")}
                  className={`relative pb-3 text-sm font-bold transition ${queueTab === "all"
                    ? "text-blue-700"
                    : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  All Claims ({claims.length})
                  {queueTab === "all" && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-700" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setManagerClaimId(
                      selectedClaim || claims[0]?.intake.claim_core.claim_id || ""
                    );
                    setShowAssignmentManager(true);
                  }}
                  className="mb-2 ml-auto rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
                >
                  Manage assignments
                </button>
              </div>

              <div className="mb-3 flex justify-end">
                <button
                  onClick={openPrioritySettings}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  <IconSliders />
                  Tune priority model
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

      {showAssignmentManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-auto w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* Header - Fixed */}
            <div className="flex items-start justify-between border-b border-slate-200 p-5 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Assignment workspace</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-950">Manage claims and operators</h2>
                <p className="mt-1 text-xs text-slate-500">Select a claim, then pick the operator who should handle it. Manual changes supersede system rules.</p>
              </div>
              <button
                onClick={() => setShowAssignmentManager(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <IconX />
              </button>
            </div>

            {/* Scrollable Grid Body */}
            <div className="grid md:grid-cols-[0.9fr_1.4fr] overflow-hidden flex-1 min-h-0">

              {/* Left Column: All Claims */}
              <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700">All claims</p>
                  <span className="text-[10px] font-semibold text-slate-400">{claims.length} total</span>
                </div>
                <div className="space-y-2">
                  {claims.map((claim) => {
                    const id = getClaimId(claim);
                    const isSelected = managerClaimId === id;
                    const assignedTo = claim.assigned_operator_id;
                    return (
                      <button
                        key={id}
                        onClick={() => setManagerClaimId(id)}
                        className={`w-full rounded-xl border p-3 text-left transition ${isSelected
                            ? "border-blue-400 bg-white shadow-sm ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-200"
                          }`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span>
                            <span className="block text-xs font-bold text-slate-900">{id}</span>
                            <span className="mt-0.5 block text-[10px] text-slate-500">
                              Client {claim.intake.claim_core.client_id} · Score {claim.priority_score}
                            </span>
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${assignedTo ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {assignedTo ? `Op ${assignedTo}` : "Unassigned"}
                          </span>
                        </span>
                        <span className="mt-2 flex flex-wrap gap-1">
                          {claim.required_skills?.map((skill) => (
                            <span key={skill} className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700">{skill}</span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Operators Workspace */}
              <div className="overflow-y-auto p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {managerClaim ? `Claim ${managerClaimId}` : "Select a claim"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">Pick the operator who should handle this claim. Assigning a different operator replaces the current one.</p>
                  </div>
                </div>

                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[10px] font-semibold leading-relaxed text-amber-800">
                  Manual changes override skill and capacity rules and are recorded in the assignment audit log.
                </div>

                {assignmentError && (
                  <p role="alert" className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                    {assignmentError}
                  </p>
                )}

                <div className="space-y-2">
                  {managerClaim && operators.map((operator) => {
                    const requiredSkills = managerClaim.required_skills ?? [];
                    const matchingSkills = (operator.skills ?? []).filter((s) => requiredSkills.includes(s.skill_type));
                    const isAssigned = managerAssignedId === operator.operator_id;
                    const assignedCount = claims.filter(
                      (c) => c.assigned_operator_id === operator.operator_id,
                    ).length;
                    const atCapacity = assignedCount >= operator.max_daily_capacity;

                    return (
                      <div
                        key={operator.operator_id}
                        className={`flex items-center gap-3 rounded-xl border p-3 transition ${isAssigned ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200"
                          }`}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                          {operator.first_name?.[0]}{operator.last_name?.[0]}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{operator.first_name} {operator.last_name}</span>
                            <span className={`size-1.5 rounded-full ${atCapacity ? "bg-slate-300" : "bg-emerald-500"}`} />
                            <span className="text-[9px] text-slate-400">{assignedCount}/{operator.max_daily_capacity}</span>
                          </span>
                          <span className="mt-1 flex flex-wrap gap-1">
                            {operator.skills?.map((s) => (
                              <span
                                key={s.skill_type}
                                className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${requiredSkills.includes(s.skill_type) ? "bg-blue-100 text-blue-700" : "bg-white text-slate-600"}`}
                              >
                                {s.skill_type}
                              </span>
                            ))}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className={`block text-[9px] font-bold ${matchingSkills.length > 0 ? "text-emerald-700" : "text-amber-600"}`}>
                            {matchingSkills.length} skill match{matchingSkills.length === 1 ? "" : "es"}
                          </span>
                          <button
                            disabled={assignmentSaving || isAssigned}
                            onClick={() => saveAssignment(managerClaimId, operator.operator_id)}
                            className={`mt-1 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition disabled:opacity-50 ${isAssigned
                                ? "border border-emerald-200 bg-white text-emerald-700"
                                : "bg-blue-700 text-white hover:bg-blue-800"
                              }`}
                          >
                            {isAssigned ? "Assigned" : managerAssignedId ? "Reassign here" : "Assign"}
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 shrink-0">
              <p className="text-[10px] text-slate-500">{assignmentSaving ? "Saving..." : "Changes are saved immediately"}</p>
              <button
                onClick={() => setShowAssignmentManager(false)}
                className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}


      {showPrioritySettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => {
            if (!savingWeights) setShowPrioritySettings(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="priority-settings-title"
            className="my-auto w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-start justify-between border-b border-slate-200 p-5 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                  Priority model
                </p>
                <h2
                  id="priority-settings-title"
                  className="mt-1 text-lg font-extrabold text-slate-950"
                >
                  Fine-tune score calculation
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Adjust how strongly each factor contributes to a claim's priority.
                </p>
              </div>

              <button
                onClick={() => setShowPrioritySettings(false)}
                disabled={savingWeights}
                aria-label="Close priority settings"
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <IconX />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="space-y-5 p-5 overflow-y-auto flex-1">
              {loadingWeights ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  Loading priority settings...
                </div>
              ) : (
                <>
                  {(
                    [
                      [
                        "financial",
                        "Financial impact",
                        "How strongly billed amounts affect priority.",
                      ],
                      [
                        "aging",
                        "Claim age",
                        "How strongly time spent pending affects priority.",
                      ],
                      [
                        "strategic",
                        "Strategic risk",
                        "How strongly client importance and PAR status affect priority.",
                      ],
                      [
                        "efficiency",
                        "Resolution efficiency",
                        "How strongly the pend reason affects priority.",
                      ],
                    ] as const
                  ).map(([key, label, description]) => (
                    <label key={key} className="block">
                      <span className="mb-2 flex items-center justify-between gap-3">
                        <span>
                          <span className="text-xs font-bold text-slate-800">
                            {label}
                          </span>

                          <span className="mt-0.5 block text-[10px] text-slate-400">
                            {description}
                          </span>
                        </span>

                        <span className="flex shrink-0 items-center overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                          <input
                            aria-label={`${label} weight`}
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={priorityWeights[key]}
                            disabled={savingWeights}
                            onChange={(event) => {
                              if (event.target.value === "") return;

                              setPriorityWeights((current) =>
                                rebalanceWeights(
                                  current,
                                  key,
                                  Number(event.target.value),
                                ),
                              );
                            }}
                            className="w-14 bg-transparent px-2 py-1 text-right text-xs font-extrabold text-slate-700 outline-none disabled:opacity-50"
                          />
                          <span className="pr-2 text-xs font-bold text-slate-400">
                            %
                          </span>
                        </span>
                      </span>

                      <input
                        aria-label={`${label} weight slider`}
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={priorityWeights[key]}
                        disabled={savingWeights}
                        onChange={(event) =>
                          setPriorityWeights((current) =>
                            rebalanceWeights(
                              current,
                              key,
                              Number(event.target.value),
                            ),
                          )
                        }
                        className="h-2 w-full cursor-pointer accent-blue-700 disabled:opacity-50"
                      />
                    </label>
                  ))}

                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Weight distribution
                      </p>
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-700">
                        Total{" "}
                        {Object.values(priorityWeights).reduce(
                          (sum, weight) => sum + weight,
                          0,
                        )}
                        %
                      </span>
                    </div>

                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200">
                      {(
                        [
                          ["financial", "bg-blue-700"],
                          ["aging", "bg-emerald-500"],
                          ["strategic", "bg-violet-500"],
                          ["efficiency", "bg-amber-400"],
                        ] as const
                      ).map(([key, color]) => (
                        <div
                          key={key}
                          className={`${color} transition-all`}
                          style={{ width: `${priorityWeights[key]}%` }}
                          title={`${key}: ${priorityWeights[key]}%`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                      Claim scores are recalculated by the backend when you save.
                      Changing weights may also change operator assignments.
                    </p>
                  </div>
                </>
              )}

              {priorityError && (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
                >
                  {priorityError}
                </p>
              )}

              {priorityMessage && (
                <p
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"
                >
                  {priorityMessage}
                </p>
              )}
            </div>

            {/* Footer - Fixed */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 shrink-0">
              <button
                disabled={loadingWeights || savingWeights}
                onClick={() => {
                  setPriorityWeights({ ...defaultWeights });
                  setPriorityError("");
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50"
              >
                Reset defaults
              </button>

              <button
                disabled={loadingWeights || savingWeights}
                onClick={savePrioritySettings}
                className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingWeights ? "Saving..." : "Save and apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}