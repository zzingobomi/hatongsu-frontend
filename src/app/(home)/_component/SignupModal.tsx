"use client";

import AuthUI, { AuthViewType } from "@/components/auth/AuthUI";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function SignupModal() {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-wrapper">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-transform transform hover:scale-110"
          aria-label="Close"
          onClick={onClickClose}
        >
          <FaTimes size={24} />
        </button>
        <div className="auth-modal-content">
          <AuthUI viewType={AuthViewType.SIGNUP} />
        </div>
      </div>
    </div>
  );
}
