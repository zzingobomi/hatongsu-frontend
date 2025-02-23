"use client";

import { World } from "@/world";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatView from "@/components/gallery/ChatView";
import { isMobileDevice } from "@/utils/device";
import ControlsGuide from "@/components/gallery/ControlsGuide";
import PubSub from "pubsub-js";

export default function Main() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const worldRef = useRef<World>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (!storedNickname) {
      router.push("/lobby");
    } else {
      // 모바일 기기 체크
      if (isMobileDevice()) {
        setShowMobileWarning(true);
        return;
      }

      setNickname(storedNickname);
      (async () => {
        const { World } = await import("@/world");
        worldRef.current = new World();
      })();
    }
  }, [router]);

  useEffect(() => {
    const token = PubSub.subscribe("WORLD_CONNECTION_FAILED", () => {
      setShowConnectionError(true);
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const MobileWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">🚫 PC 최적화 페이지</h2>
        <p className="mb-4">
          갤러리는 PC 환경에 최적화되어 있습니다.
          <br />
          데스크탑에서 접속해주세요!
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );

  const ConnectionErrorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">⚠️ 연결 오류</h2>
        <p className="mb-4">
          서버에 연결할 수 없습니다.
          <br />
          네트워크 상태를 확인하고 새로고침 해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          새로고침
        </button>
      </div>
    </div>
  );

  if (!nickname || showMobileWarning) {
    return <MobileWarningModal />;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      <canvas id="world-canvas" className="w-full h-full"></canvas>
      <ControlsGuide />
      <ChatView />
      {showConnectionError && <ConnectionErrorModal />}
    </div>
  );
}
