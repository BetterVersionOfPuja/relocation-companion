import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import {
  deleteCurrentUser,
  updateCurrentUser,
} from "../services/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

const getInitials = (user) =>
  (user?.fullName || user?.username || "RC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const initials = useMemo(() => getInitials(user), [user]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setStatus({ type: "", message: "" });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSubmitting("profile");
    setStatus({ type: "", message: "" });

    try {
      const payload = await updateCurrentUser({
        fullName: form.fullName,
        email: form.email,
      });
      const nextUser = payload?.data || null;
      setUser(nextUser);
      setEditing(false);
      setStatus({ type: "success", message: "Profile updated." });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to update profile."),
      });
    } finally {
      setSubmitting("");
    }
  };

  const handleLogout = async () => {
    setSubmitting("logout");
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setSubmitting("");
    }
  };

  const handleDeleteAccount = async () => {
    setSubmitting("delete");
    setStatus({ type: "", message: "" });

    try {
      await deleteCurrentUser();
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to delete account."),
      });
      setSubmitting("");
    }
  };

  return (
    <PageTransition className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-2xl place-items-center py-6 md:py-10">
      <section className="w-full rounded-xl border border-slate-900 bg-slate-950/50 p-5 shadow-sm backdrop-blur-md md:p-6">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold tracking-wide text-slate-200">
            {initials}
          </div>
          <p className="eyebrow mt-4">Account Profile</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            {(user?.fullName || "Relocation Member").toUpperCase()}
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
            {user?.email}
          </p>
        </div>

        {status.message && (
          <p
            className={`mt-6 rounded-lg border px-4 py-3 text-center text-sm font-bold ${
              status.type === "success"
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                : "border-red-300/20 bg-red-400/10 text-red-100"
            }`}
          >
            {status.message}
          </p>
        )}

        {editing && (
          <form className="mt-6 grid gap-3" onSubmit={handleSaveProfile}>
            <label className="grid gap-2 text-left">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Full Name
              </span>
              <input
                className="select-shell h-10 rounded-lg px-3 text-sm font-semibold"
                value={form.fullName}
                onChange={updateField("fullName")}
                required
              />
            </label>
            <label className="grid gap-2 text-left">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Email Address
              </span>
              <input
                className="select-shell h-10 rounded-lg px-3 text-sm font-semibold"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="blue-button min-h-10 rounded-lg px-4 text-sm font-semibold"
                disabled={submitting === "profile"}
              >
                {submitting === "profile" ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="min-h-10 rounded-lg border border-slate-800 px-4 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {!editing && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-900"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-900"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-900 disabled:cursor-wait disabled:opacity-60"
              onClick={handleLogout}
              disabled={submitting === "logout"}
            >
              {submitting === "logout" ? "Signing out..." : "Sign Out / Logout"}
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-slate-900 pt-5 text-center">
          {!confirmDelete ? (
            <button
              type="button"
              className="rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-red-300/80 transition hover:border-red-300/20 hover:text-red-200"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="rounded-lg border border-red-300/15 bg-red-400/5 p-4">
              <p className="text-sm leading-6 text-red-100">
                This permanently deletes your account and saved comparisons.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-red-300/30 px-4 text-sm font-black text-red-100 transition hover:bg-red-400/10 disabled:cursor-wait disabled:opacity-60"
                  onClick={handleDeleteAccount}
                  disabled={submitting === "delete"}
                >
                  {submitting === "delete" ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-black text-slate-300 transition hover:bg-white/[0.04]"
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep Account
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Profile;
