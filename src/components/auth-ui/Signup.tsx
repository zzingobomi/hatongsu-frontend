"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import OauthSignIn from "./OauthSignIn";
import Separator from "./Separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const signUpSchema = z
  .object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요"),
    nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다"),
    password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const authHeader = `Basic ${Buffer.from(
        `${data.email}:${data.password}`
      ).toString("base64")}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ nickname: data.nickname }),
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
        <Link href="/login">로그인 페이지로 이동</Link>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Nickname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
          </form>
        </Form>
        <p className="mt-4 text-sm dark:text-white">
          <Link href="/login">이미 계정이 있으신가요? 로그인</Link>
        </p>
      </>
    );
  }
}
