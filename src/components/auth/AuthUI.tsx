"use client";

import PasswordSignIn from "../auth-ui/PasswordSignIn";
import SignUp from "../auth-ui/Signup";

export enum AuthViewType {
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgot_password",
  PASSWORD_SIGNIN = "password_signin",
}

interface AuthUIProps {
  viewType: AuthViewType;
}

export default function AuthUI({ viewType }: AuthUIProps) {
  return (
    <div className="my-auto mb-auto flex flex-col w-full lg:mt-[16px] lg:min-w-[420px]">
      {viewType === AuthViewType.PASSWORD_SIGNIN && <PasswordSignIn />}
      {/* {viewType === "forgot_password" && (
        <ForgotPassword
          allowEmail={allowEmail}
          redirectMethod={redirectMethod}
          disableButton={disableButton}
        />
      )} */}
      {viewType === AuthViewType.SIGNUP && <SignUp />}
    </div>
  );
}
