"use client";

import OauthSignIn from "../auth-ui/OauthSignIn";
import PasswordSignIn from "../auth-ui/PasswordSignIn";
import Separator from "../auth-ui/Separator";
import SignUp from "../auth-ui/Signup";

export enum AuthViewType {
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgot_password",
  UPDATE_PASSWORD = "update_password",
  PASSWORD_SIGNIN = "password_signin",
}

interface AuthUIProps {
  viewType: AuthViewType;
  allowOauth: boolean;
}

export default function AuthUI({ viewType, allowOauth }: AuthUIProps) {
  return (
    <div className="my-auto mb-auto mt-8 flex flex-col md:max-w-full lg:mt-[130px] lg:max-w-[420px]">
      <p className="text-[32px] font-bold text-zinc-950 dark:text-white">
        {viewType === AuthViewType.SIGNUP
          ? "Sign Up"
          : viewType === AuthViewType.FORGOT_PASSWORD
          ? "Forgot Password"
          : viewType === AuthViewType.UPDATE_PASSWORD
          ? "Update Password"
          : "Sign In"}
      </p>
      <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">
        {viewType === AuthViewType.SIGNUP
          ? "Enter your email and password to sign up!"
          : viewType === AuthViewType.FORGOT_PASSWORD
          ? "Enter your email to get a passoword reset link!"
          : viewType === AuthViewType.UPDATE_PASSWORD
          ? "Choose a new password for your account!"
          : "Enter your email and password to sign in!"}
      </p>
      {viewType !== AuthViewType.UPDATE_PASSWORD &&
        viewType !== AuthViewType.SIGNUP &&
        allowOauth && (
          <>
            <OauthSignIn />
            <Separator />
          </>
        )}
      {viewType === AuthViewType.PASSWORD_SIGNIN && <PasswordSignIn />}
      {/* {viewType === "forgot_password" && (
        <ForgotPassword
          allowEmail={allowEmail}
          redirectMethod={redirectMethod}
          disableButton={disableButton}
        />
      )} */}
      {/* {viewType === "update_password" && (
        <UpdatePassword redirectMethod={redirectMethod} />
      )} */}
      {viewType === AuthViewType.SIGNUP && <SignUp />}
    </div>
  );
}
