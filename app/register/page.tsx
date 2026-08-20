"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthCard } from "@/components/AuthCard";
import { FormField } from "@/components/FormField";
import { registerSchema, type RegisterFormValues } from "@/validators/auth";
import { getErrorMessage } from "@/api/client";
import { useSeo } from "@/hooks/useSeo";

export default function Register() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  useSeo({ title: "Create your account", description: "Sign up and start publishing.", noindex: true });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        displayName: values.displayName?.trim() || undefined,
      });
      router.push("/");
    } catch (err) {
      setServerError(getErrorMessage(err, "Couldn't create your account — please try again."));
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join to start uploading, following and growing your audience"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--brand-primary)] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField label="Username" icon={User} placeholder="janedoe" autoComplete="username" error={errors.username?.message} {...register("username")} />
        <FormField label="Display name (optional)" placeholder="Jane Doe" autoComplete="name" error={errors.displayName?.message} {...register("displayName")} />
        <FormField label="Email" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <FormField
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          autoComplete="new-password"
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-xs text-[var(--brand-text-muted)]">By signing up you agree to our Terms of Service and Privacy Policy.</p>
      </form>
    </AuthCard>
  );
}
