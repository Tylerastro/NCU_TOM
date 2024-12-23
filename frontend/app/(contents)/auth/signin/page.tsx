import { GitHubSignIn, GoogleSignIn } from "@/components/auth/auth-components";
import CredentialForm from "@/components/auth/credentialForm";
import Image from "next/image";

export default async function SignInPage() {
  return (
    <div className="flex min-h-full flex-col justify-center px-12 py-12 lg:px-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center align-center">
        <Image
          width={250}
          height={250}
          src="/main-logo-white-transparent.png"
          alt="NCU Tom Logo"
          className="object-contain h-48 w-96"
        />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary-foreground">
          Sign in to your account
        </h2>
        <CredentialForm />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm items-center justify-center">
        <GitHubSignIn />
        <GoogleSignIn />
      </div>
    </div>
  );
}
