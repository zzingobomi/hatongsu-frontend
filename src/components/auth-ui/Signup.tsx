"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import OauthSignIn from "./OauthSignIn";
import Separator from "./Separator";

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nickname = formData.get("nickname") as string;

    try {
      const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString(
        "base64"
      )}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ nickname }),
        }
      );

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      setSignupCompleted(true);
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
  };

  if (signupCompleted) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold dark:text-white">
          회원가입을 축하합니다!
        </h2>
        <p className="mt-4 dark:text-white">
          이제 로그인 페이지로 이동할 수 있습니다.
        </p>
        <Button
          onClick={() => router.replace("/login")}
          className="mt-6 px-4 py-2"
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  } else {
    return (
      <>
        <p className="text-[32px] font-bold text-zinc-950 dark:text-white">
          Sign Up
        </p>
        <OauthSignIn />
        <Separator />
        <div className="mb-8">
          <form
            noValidate={true}
            className="mb-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="grid gap-2">
              <div className="grid gap-1">
                <label
                  className="text-zinc-950 dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  className="mr-2.5 mb-2 h-full min-h-[44px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  name="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
                <label
                  className="text-zinc-950 mt-2 dark:text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="mr-2.5 mb-2 h-full min-h-[44px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400"
                />
                <label
                  className="text-zinc-950 mt-2 dark:text-white"
                  htmlFor="nickname"
                >
                  Nickname
                </label>
                <Input
                  id="nickname"
                  placeholder="Nickname"
                  name="nickname"
                  className="mr-2.5 mb-2 h-full min-h-[44px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400"
                />
              </div>
              <Button
                type="submit"
                className="mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
              >
                {isSubmitting ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="mr-2 inline h-4 w-4 animate-spin text-zinc-200 duration-500 dark:text-zinc-950"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="white"
                    ></path>
                  </svg>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          </form>
          {/* <p>
        <Link
          href="/dashboard/signin/forgot_password"
          className="font-medium text-zinc-950 dark:text-white text-sm"
        >
          Forgot your password?
        </Link>
      </p> */}
          <p className="font-medium text-sm dark:text-white">
            <button
              onClick={() => router.replace("/login")}
              className="font-medium text-zinc-950 dark:text-white text-sm"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </p>
        </div>
      </>
    );
  }
}
