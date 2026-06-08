import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authErrors";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    if (!values.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await login({ email: values.email.trim(), password: values.password });
      setStatus({ type: "success", message: "Signed in successfully." });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: getAuthErrorMessage(error, "Unable to sign in. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="auth-page">
      <AuthCard
        title="Login to Relocation Companion"
      >
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={updateValue("email")}
            error={errors.email}
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={updateValue("password")}
            error={errors.password}
          />

          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}

          <AuthButton type="submit" loading={submitting}>
            Login
          </AuthButton>
        </form>

        <p className="auth-switch">
          New to Relocation Companion? <Link to="/register">Create Account</Link>
        </p>
      </AuthCard>
    </PageTransition>
  );
};

export default Login;
