import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCityList, fetchComparison } from "../api/cityApi";
import {
  deleteSavedComparison,
  fetchSavedComparisons,
} from "../api/savedComparisonApi";
import SavedComparisons from "../components/SavedComparisons";
import PageTransition from "../components/common/PageTransition";
import {
  buildSavedComparisonSummary,
  cityDisplayName,
  decodeComparison,
  getWinningCityProfile,
  normalizeCityName,
} from "../utils/comparisonInsights";

const findCityByDisplayName = (cities, displayName) => {
  const target = normalizeCityName(displayName);
  return cities.find((city) => normalizeCityName(cityDisplayName(city)) === target);
};

const enrichSavedComparison = async (saved, cities) => {
  const origin = findCityByDisplayName(cities, saved.originCity);
  const destination = findCityByDisplayName(cities, saved.destinationCity);

  if (!origin || !destination) {
    return {
      saved,
      unavailable: true,
      error: "One or both cities are no longer available.",
    };
  }

  const analysis = await fetchComparison(origin.slug, destination.slug);
  const decoded = decodeComparison(analysis);

  return {
    saved,
    analysis,
    decoded,
    winner: getWinningCityProfile(analysis, decoded),
    summary: buildSavedComparisonSummary(analysis, decoded),
  };
};

const SavedMoves = () => {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        if (!ignore) setLoading(true);
        return Promise.all([fetchSavedComparisons(), fetchCityList()]);
      })
      .then(async ([savedComparisons, cities]) => {
        const enrichedComparisons = await Promise.all(
          savedComparisons.map((saved) => enrichSavedComparison(saved, cities))
        );

        if (!ignore) {
          setComparisons(enrichedComparisons.filter((comparison) => !comparison.unavailable));
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          setError("Saved moves could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleViewAnalysis = (savedComparison) => {
    navigate("/", {
      state: {
        savedComparison: {
          originCity: savedComparison.originCity,
          destinationCity: savedComparison.destinationCity,
        },
      },
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteSavedComparison(id);
      setComparisons((current) => current.filter((comparison) => comparison.saved._id !== id));
    } catch (err) {
      console.error(err);
      setError("Saved move could not be deleted. Please try again.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <PageTransition className="saved-page">
      <SavedComparisons
        comparisons={comparisons}
        loading={loading}
        onViewAnalysis={handleViewAnalysis}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {error && (
        <div className="glass-panel mx-auto mt-5 max-w-2xl rounded-lg p-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-300">
            {error}
          </p>
        </div>
      )}
    </PageTransition>
  );
};

export default SavedMoves;
