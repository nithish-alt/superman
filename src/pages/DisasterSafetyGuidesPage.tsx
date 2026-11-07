import React, { useState } from 'react';
import {
  BookOpen,
  Droplets,
  Activity,
  Wind,
  Flame,
  CheckCircle2,
  XCircle,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const DisasterSafetyGuidesPage: React.FC = () => {
  const [activeDisaster, setActiveDisaster] = useState<'Flood' | 'Earthquake' | 'Cyclone' | 'Fire'>('Earthquake');
  const [activePhase, setActivePhase] = useState<'BEFORE' | 'DURING' | 'AFTER'>('DURING');

  const guides = {
    Earthquake: {
      title: 'Earthquake Safety Guide',
      subtitle: 'Seismic Hazards & Tremor Protection (Drop, Cover, and Hold On)',
      icon: Activity,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      before: [
        'Secure heavy laboratory cupboards, book racks, and projectors to structural walls.',
        'Memorize campus emergency exits and locate open assembly zones without overhead power cables.',
        'Keep a classroom emergency kit with first-aid bandages, whistles, battery torches, and a battery radio.',
        'Practice the "Drop, Cover, and Hold On" drill twice every academic term.',
      ],
      during: [
        'DROP down onto your hands and knees immediately to prevent being knocked over.',
        'COVER your head and neck under a sturdy desk or table. If no desk is near, crouch against an interior wall.',
        'HOLD ON to your shelter until violent shaking ceases. Protect your eyes from shattering glass.',
        'DO NOT run outside while shaking is occurring — falling masonry and glass cause 80% of injuries.',
        'DO NOT use elevators or enter crowded stairwells during tremors.',
      ],
      after: [
        'Evacuate in single file to designated outdoor sports grounds (Assembly Ground Alpha).',
        'Check classmates for injuries and report any missing peers to your teacher immediately.',
        'Do not touch exposed electrical cables, fallen transformers, or broken gas pipes.',
        'Expect aftershocks. Stay in open fields until structural safety engineers declare buildings safe.',
      ],
      dos: [
        'Drop under a heavy timber desk or bench',
        'Cover the back of your neck with both arms',
        'Turn off Bunsen burners & gas mains if in science labs',
        'Listen quietly to floor marshal instructions',
      ],
      donts: [
        'Do NOT panic, scream, or shove friends',
        'Do NOT stand near exterior glass windows or decorative facades',
        'Do NOT light matches or candles (gas leak risk)',
        'Do NOT rush toward stairways while tremors continue',
      ],
      checklist: [
        'Sturdy classroom desks positioned away from full-height glass',
        'Working whistle in student emergency pouches',
        'Battery-operated megaphone with floor marshal',
        'Class attendance muster register held by teacher',
      ],
    },

    Flood: {
      title: 'Monsoon Flood & Flash Flood Safety Guide',
      subtitle: 'Heavy Rainfall, Urban Inundation & Rising River Protocol',
      icon: Droplets,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      before: [
        'Identify whether your school or college campus lies in a low-lying river floodplain or coastal bowl.',
        'Store important academic certificates, electrical generators, and IT server racks on the first or second floor.',
        'Clean perimeter stormwater drains and culverts before the monsoon onset in June.',
        'Keep emergency bottled drinking water and chlorine purification tablets stocked.',
      ],
      during: [
        'Move students upward to the second or third floor of solid multi-story academic blocks (vertical evacuation).',
        'Turn off main electricity breakers at the main distribution panel before water reaches outlets.',
        'Never walk, wade, or swim through moving floodwaters — just 15 cm of swift water can sweep an adult off their feet.',
        'Stay away from flooded manholes, electrical junction boxes, and street drainage sumps.',
      ],
      after: [
        'Drink only boiled or purified water to prevent cholera, typhoid, and waterborne illnesses.',
        'Do not eat flood-submerged food or cafeteria snacks.',
        'Be alert for snakes, rodents, and insects seeking dry refuge inside classrooms.',
        'Allow school buildings to be disinfected with bleaching powder before resuming classes.',
      ],
      dos: [
        'Move to higher floors with dry food & water bottles',
        'Switch off the main electric circuit breakers',
        'Keep mobile phones charged with power banks',
        'Follow official IMD & District Collector directives',
      ],
      donts: [
        'Do NOT step into murky stagnant water (snake & leptospirosis risk)',
        'Do NOT drive school buses or two-wheelers through flooded underpasses',
        'Do NOT touch electrical appliances standing on wet floors',
        'Do NOT spread unverified social media flood rumours',
      ],
      checklist: [
        'Drinking water purification tablets (Halazone/Chlorine)',
        'Inflatable buoyancy life-vests in sports storeroom',
        'Terrace solar emergency lamp charged',
        'High-elevation dry storage for student medical records',
      ],
    },

    Cyclone: {
      title: 'Tropical Cyclone & Severe Storm Guide',
      subtitle: 'High Wind Velocity, Storm Surge & Structural Shelter Protocol',
      icon: Wind,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      before: [
        'Inspect and trim weak tree branches, loose roof tiles, and exterior billboards on campus.',
        'Install safety film or tape large window panes with masking tape in an X-pattern.',
        'Stock 72 hours of non-perishable food, batteries, medical kits, and blankets in the campus shelter.',
        'Identify the safest interior room (windowless auditorium core, reinforced library hall).',
      ],
      during: [
        'Stay indoors inside interior rooms away from glass windows and tin roofs.',
        'Close all exterior doors and windows securely. Fasten storm shutters.',
        'Beware of the "Eye of the Cyclone" — a deceptive period of calm. Winds will suddenly reverse and surge violently.',
        'Disconnect all computers, lab equipment, and television antennas.',
      ],
      after: [
        'Remain inside until the local district administration or IMD announces the cyclone has passed completely.',
        'Beware of snapped live electric wires dangling from uprooted banyan or neem trees.',
        'Report structural wall cracks, fallen roofs, or gas odors to the Chairman.',
        'Assist sanitation teams in removing debris from campus pathways.',
      ],
      dos: [
        'Huddle in interior corridors or windowless rooms',
        'Keep emergency battery radio tuned to Akashvani (AIR)',
        'Anchor loose outdoor benches and sports equipment',
        'Wear closed sports shoes to protect feet from glass shards',
      ],
      donts: [
        'Do NOT go outdoors during the eye of the cyclone calm',
        'Do NOT stand under tall trees or electric poles',
        'Do NOT touch fallen wires or damp masonry walls',
        'Do NOT venture near the seashore to watch high tidal waves',
      ],
      checklist: [
        'Heavy-duty battery lanterns and spare torches',
        'AM/FM portable battery radio for IMD storm alerts',
        'Heavy plastic tarpaulins and nylon ropes',
        'Emergency student emergency contact registry',
      ],
    },

    Fire: {
      title: 'Campus Fire & Electrical Hazard Guide',
      subtitle: 'Smoke Egress, Fire Extinguishers (PASS Method) & Safe Evacuation',
      icon: Flame,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      before: [
        'Ensure all campus corridors, staircases, and fire exits remain 100% free of bicycles or unused desks.',
        'Check fire extinguishers (ABC Dry Chemical Powder & CO2) every month for green pressure gauge reading.',
        'Train all high school students and teachers in the P-A-S-S technique (Pull, Aim, Squeeze, Sweep).',
        'Install smoke alarms and illuminated photoluminescent EXIT signs along all paths.',
      ],
      during: [
        'Sound the nearest manual fire alarm pull station immediately.',
        'CRAWL LOW under smoke — clean, breathable air is always within 30 to 60 cm of the floor.',
        'Feel doors with the back of your hand before opening. If hot, DO NOT OPEN; use secondary window or exit.',
        'Never enter an elevator. Walk briskly down the fire staircase to the ground.',
        'If clothes catch fire: STOP, DROP, AND ROLL to smother the flames.',
      ],
      after: [
        'Assemble immediately at Assembly Ground Alpha for headcount roll call.',
        'NEVER re-enter a burning building to retrieve bags, books, or phones.',
        'Inform the fire brigade officer immediately if any student is trapped or unaccounted for.',
        'Cool minor burns with clean cold running water for 15 minutes. Do not apply ghee or butter.',
      ],
      dos: [
        'Crawl low under smoke with a damp cloth over nose',
        'Follow illuminated EXIT signboards calmly',
        'Assemble on the open athletics ground',
        'Report headcount to the class teacher within 3 minutes',
      ],
      donts: [
        'Do NOT use elevators under any circumstances',
        'Do NOT run back inside for school bags or wallets',
        'Do NOT lock exit doors during school hours',
        'Do NOT open doors that feel warm to touch',
      ],
      checklist: [
        'Fire extinguishers mounted at 1.2m height with valid inspection tags',
        'Sand buckets and fire blankets in Chemistry laboratories',
        'Functional fire hose reels with tested water pressure',
        'Emergency siren audible across all classrooms and hostels',
      ],
    },
  };

  const currentGuide = guides[activeDisaster];
  const Icon = currentGuide.icon;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">DISASTER SAFETY GUIDES</h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              Student & Teacher Handbook
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Practical, easy-to-understand survival directives for Indian schools and colleges covering Before, During, and After phases for Earthquake, Flood, Cyclone, and Fire hazards.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Aligned with NDMA Institutional Safety Standards</span>
        </div>
      </div>

      {/* 4 Disaster Category Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Earthquake', 'Flood', 'Cyclone', 'Fire'] as const).map((disasterKey) => {
          const item = guides[disasterKey];
          const isSelected = activeDisaster === disasterKey;
          const DisIcon = item.icon;

          return (
            <button
              key={disasterKey}
              onClick={() => setActiveDisaster(disasterKey)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'bg-slate-850 border-blue-500 shadow-xl ring-2 ring-blue-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${item.color}`}
              >
                <DisIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{item.title.split(' ')[0]} Safety</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Main Guide Content: 3 Chronological Phases (BEFORE, DURING, AFTER) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* Guide Title Lockup */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentGuide.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentGuide.title}</h2>
              <p className="text-xs text-slate-400">{currentGuide.subtitle}</p>
            </div>
          </div>

          {/* 3 Chronological Phase Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {(['BEFORE', 'DURING', 'AFTER'] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  activePhase === phase
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {phase}: {phase === 'BEFORE' ? 'Preparation' : phase === 'DURING' ? 'Survival Steps' : 'Recovery'}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Action Directives */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {activePhase} THE {activeDisaster.toUpperCase()}: PROTOCOL DIRECTIVES
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {(activePhase === 'BEFORE'
              ? currentGuide.before
              : activePhase === 'DURING'
              ? currentGuide.during
              : currentGuide.after
            ).map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-900/90 rounded-lg border border-slate-800/80 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DOs and DON'Ts Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO's List */}
          <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                DO's (Must Follow)
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentGuide.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'Ts List */}
          <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
              <XCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-sm font-bold text-red-300 uppercase tracking-wide">
                DON'Ts (Strictly Prohibited)
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentGuide.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preparation Checklist */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Campus Emergency Preparation Checklist for {activeDisaster}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {currentGuide.checklist.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-2.5"
              >
                <span className="w-4 h-4 rounded border border-blue-400/50 bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
