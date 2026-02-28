import { GitHubSignIn, GoogleSignIn } from "@/components/auth/auth-components";
import CredentialForm from "@/components/auth/credentialForm";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 ">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 p-8 shadow-2xl shadow-black/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              width={180}
              height={180}
              src="/main-logo-white-transparent.png"
              alt="NCU Tom Logo"
              className="object-contain h-32 w-32"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to continue to NCU TOM
            </p>
          </div>

          {/* Credential Form */}
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-800 rounded" />
                <div className="h-10 bg-gray-800 rounded" />
                <div className="h-10 bg-gray-800 rounded" />
              </div>
            }
          >
            <CredentialForm />
          </Suspense>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-500 bg-gray-900/50">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <GitHubSignIn />
            <GoogleSignIn />
          </div>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-amber-500 hover:text-amber-400 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
