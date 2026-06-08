import { motion } from "framer-motion";

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 18h10l1-18" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const SavedComparisonCard = ({ item, onViewAnalysis, onDelete, deleting }) => (
  <motion.article
    className="flex min-h-[17rem] flex-col justify-between rounded-xl border border-slate-900 bg-slate-950/50 p-4 shadow-sm transition hover:border-slate-700 md:p-5"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
  >
    <div>
      <h3 className="text-base font-bold leading-tight tracking-tight text-white md:text-lg">
        {item.analysis.cityOne.name} vs {item.analysis.cityTwo.name}
      </h3>

      <div className="mt-3 inline-flex max-w-full items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
        <span className="truncate">
          {"\u2713"} {item.winner.name} ({item.decoded.verdict.confidenceScore}% Confidence)
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
        {item.summary}
      </p>
    </div>

    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-900/80 pt-3">
      <button
        type="button"
        className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:border-slate-700 hover:bg-slate-900"
        onClick={() => onViewAnalysis(item.saved)}
      >
        Open in Engine
      </button>
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900 hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
        onClick={() => onDelete(item.saved._id)}
        disabled={deleting}
        aria-label={`Delete ${item.analysis.cityOne.name} vs ${item.analysis.cityTwo.name}`}
        title="Delete saved move"
      >
        <TrashIcon />
      </button>
    </div>
  </motion.article>
);

const SavedComparisons = ({
  comparisons,
  loading,
  onViewAnalysis,
  onDelete,
  deletingId,
}) => (
  <section className="saved-moves mx-auto w-full max-w-7xl">
    <div className="section-header">
      <p className="eyebrow">Saved Comparison Dashboard</p>
      <h2>Saved Moves</h2>
      <p>Review your saved city pairs and reopen any full comparison in the engine.</p>
    </div>

    <div className="mt-6">
      {loading ? (
        <div className="saved-moves-panel">
          <p className="saved-empty">Loading saved moves...</p>
        </div>
      ) : comparisons.length === 0 ? (
        <div className="saved-moves-panel">
          <p className="saved-empty">No saved moves yet. Start comparing cities to save your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {comparisons.map((item) => (
            <SavedComparisonCard
              key={item.saved._id}
              item={item}
              onViewAnalysis={onViewAnalysis}
              onDelete={onDelete}
              deleting={deletingId === item.saved._id}
            />
          ))}
        </div>
      )}
    </div>
  </section>
);

export default SavedComparisons;
