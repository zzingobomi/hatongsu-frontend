"use client";

import LobbyUI from "@/components/lobby/LobbyUI";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function LobbyModal() {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <div className="lobby-modal">
      <div className="lobby-modal-wrapper">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-transform transform hover:scale-110"
          aria-label="Close"
          onClick={onClickClose}
        >
          <FaTimes size={24} />
        </button>
        <div className="lobby-modal-content">
          <LobbyUI />
        </div>
      </div>
    </div>
  );
}
