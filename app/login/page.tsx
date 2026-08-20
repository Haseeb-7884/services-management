"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthCard } from "@/components/AuthCard";
import { FormField } from "@/components/FormField";
import { loginSchema, type LoginFormValues } from "@/validators/auth";
import { getErrorMessage } from "@/api/client";
import { useSeo } from "@/hooks/useSeo";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  useSeo({ title: "Log in", description: "Log in to your account.", noindex: true });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      await login(values.emailOrUsername, values.password);
      router.push("/");
    } catch (err) {
      setServerError(getErrorMessage(err, "Couldn't log in — please try again."));
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue to your account"
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="font-medium text-[var(--brand-primary)] hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField label="Email or username" icon={Mail} placeholder="you@example.com or username" autoComplete="username" error={errors.emailOrUsername?.message} {...register("emailOrUsername")} />
        <FormField
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          rightElement={
            <button type="button" tabIndex={-1} onClick={() => setShowPassword((s) => !s)} className="text-[var(--brand-text-muted)] hover:text-[var(--brand-text)]">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register("password")}
        />

        {serverError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-glow flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
          {isSubmitting && <LoaderCircle size={16} className="animate-spin" />}
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
