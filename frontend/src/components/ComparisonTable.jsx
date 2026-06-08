import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { decodeComparison } from "../utils/comparisonInsights";

const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, (latest) => {
    const next = Number(latest).toFixed(decimals);
    return `${prefix}${next}${suffix}`;
  });

  useEffect(() => {
    motionValue.set(Number(value) || 0);
  }, [motionValue, value]);

  return <motion.span>{display}</motion.span>;
};

const SectionHeader = ({ kicker, title, body }) => (
  <div className="section-header">
    <p className="eyebrow">{kicker}</p>
    <h2>{title}</h2>
    {body && <p>{body}</p>}
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    className={`glass-card ${className}`}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const VerdictCard = ({ label, value, tone = "blue" }) => (
  <GlassCard className={`verdict-mini tone-${tone}`}>
    <p>{label}</p>
    <strong>{value}</strong>
  </GlassCard>
);

const ProgressComparison = ({ row, cityOneName, cityTwoName }) => {
  const max = Math.max(row.cityOneRaw, row.cityTwoRaw, 1);
  const cityOneWidth = Math.max(8, (row.cityOneRaw / max) * 100);
  const cityTwoWidth = Math.max(8, (row.cityTwoRaw / max) * 100);

  return (
    <div className="progress-comparison">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-bold text-white">{row.label}</p>
        <span className="rounded-full border border-sky-300/15 px-3 py-1 text-xs font-bold text-sky-200">
          {row.winnerLabel}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>{cityOneName}</span>
            <span>{row.cityOne}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill progress-a"
              initial={{ width: 0 }}
              whileInView={{ width: `${cityOneWidth}%` }}
              viewport={{ once: true }}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>{cityTwoName}</span>
            <span>{row.cityTwo}</span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill progress-b"
              initial={{ width: 0 }}
              whileInView={{ width: `${cityTwoWidth}%` }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{row.verdict}</p>
    </div>
  );
};

const CategoryAnalysis = ({ title, rows, cityOneName, cityTwoName }) => (
  <GlassCard className="category-card">
    <h3>{title}</h3>
    <div className="mt-6 space-y-6">
      {rows.map((row) => (
        <ProgressComparison
          key={row.key}
          row={row}
          cityOneName={cityOneName}
          cityTwoName={cityTwoName}
        />
      ))}
    </div>
  </GlassCard>
);

const ComparisonTable = ({ data }) => {
  if (!data) return null;

  const { cityOneName, cityTwoName, rows, wins, summary, verdict } = decodeComparison(data);

  return (
    <motion.section
      className="results-suite mx-auto mt-10 w-full max-w-7xl"
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SectionHeader
        kicker="System Verdict"
        title={`${cityOneName} vs ${cityTwoName}`}
        body={summary}
      />

      <GlassCard className="verdict-card">
        <div>
          <p className="eyebrow">Recommended Move</p>
          <h3>{verdict.recommendedMove}</h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            The recommendation is based on relative wins across financial,
            lifestyle and environmental indicators.
          </p>
        </div>
        <div className="confidence-ring" aria-label={`Confidence score ${verdict.confidenceScore} percent`}>
          <div>
            <AnimatedCounter value={verdict.confidenceScore} suffix="%" />
            <span>Confidence Score</span>
          </div>
        </div>
        <div className="verdict-grid">
          <VerdictCard label="Financial Advantage" value={verdict.financialAdvantage} />
          <VerdictCard label="Lifestyle Advantage" value={verdict.lifestyleAdvantage} tone="emerald" />
          <VerdictCard label="Environmental Advantage" value={verdict.environmentalAdvantage} tone="cyan" />
          <VerdictCard label={cityOneName} value={`${wins.cityOne.total} wins`} tone="slate" />
          <VerdictCard label={cityTwoName} value={`${wins.cityTwo.total} wins`} tone="slate" />
        </div>
      </GlassCard>

      <div className="mt-12">
        <SectionHeader kicker="Category Analysis" title="Decision Drivers" />
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {["Economy", "Lifestyle", "Environment"].map((group) => (
            <CategoryAnalysis
              key={group}
              title={group}
              rows={rows.filter((row) => row.group === group)}
              cityOneName={cityOneName}
              cityTwoName={cityTwoName}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ComparisonTable;
