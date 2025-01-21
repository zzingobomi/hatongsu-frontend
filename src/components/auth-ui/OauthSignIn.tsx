"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { JSX, useState } from "react";
import { Input } from "../ui/input";

type OAuthProviders = {
  name: string;
  displayName: string;
  icon: JSX.Element;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: "google",
      displayName: "Google",
      icon: <FcGoogle className="h-5 w-5" />,
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  const signInWithOAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const provider = formData.get("provider") as string;

    try {
      const result = await signIn(provider, {
        callbackUrl: "/dashboard/main",
        redirect: true,
      });

      if (result?.error) {
        console.error("OAuth 로그인 실패:", result.error);
      }
    } catch (error) {
      console.error("OAuth 로그인 중 에러 발생:", error);
    }
  };

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          className="pb-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="outline"
            type="submit"
            className="w-full text-zinc-950 py-6 dark:text-white"
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  );
}
