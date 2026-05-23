"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 모바일/PWA 전용 pull-to-refresh.
 *
 * PWA standalone 모드(홈 화면에서 띄운 상태)에서는 브라우저의 기본
 * 당겨서 새로고침이 동작하지 않는다. 이 컴포넌트는 페이지 최상단에서
 * 아래로 당기는 터치 제스처를 감지해 `window.location.reload()`로
 * 직접 새로고침을 트리거한다.
 *
 * 동작 조건:
 * - 스크롤이 페이지 맨 위(scrollY === 0)일 때만 시작
 * - 수평 스와이프가 우세하면(좌우 캐러셀 등) 즉시 포기
 * - 햄버거 메뉴 등으로 body overflow가 잠긴 상태에선 동작 안 함
 *
 * UX:
 * - 당김 거리에 비례해 스피너 회전, 임계값 통과 시 색이 진해짐
 * - 임계값 미만에서 손을 떼면 원위치 (refresh 안 함)
 * - 임계값 이상에서 떼면 200ms 후 reload
 */

const THRESHOLD = 70; // px, 새로고침 트리거 임계값
const MAX_PULL = 120; // px, 시각적 최대 당김 거리
const DAMPING = 0.5; // 손가락 이동 대비 패널 이동 비율
const HORIZONTAL_CANCEL = 10; // 수평 이동이 이 값을 넘으면 가로 스와이프로 판단

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const distanceRef = useRef(0);

  useEffect(() => {
    const isLocked = () => document.body.style.overflow === "hidden";

    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return;
      // 모달/햄버거 패널이 열려 있으면 무시
      if (isLocked()) {
        startYRef.current = null;
        return;
      }
      // 페이지 최상단이 아니면 무시
      if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
        startYRef.current = null;
        return;
      }
      if (e.touches.length !== 1) return;
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      distanceRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null) return;
      if (refreshing) return;

      const deltaY = e.touches[0].clientY - startYRef.current;
      const deltaX = e.touches[0].clientX - startXRef.current;

      // 가로 스와이프가 더 크면 취소 (좌우 캐러셀/스와이프와 충돌 방지)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > HORIZONTAL_CANCEL) {
        startYRef.current = null;
        if (distanceRef.current > 0) {
          distanceRef.current = 0;
          setPullDistance(0);
        }
        return;
      }

      // 위로 올리는 동작이면 패널 숨김
      if (deltaY <= 0) {
        if (distanceRef.current > 0) {
          distanceRef.current = 0;
          setPullDistance(0);
        }
        return;
      }

      // 도중에 스크롤이 위로 이동했다면(점프 등) 취소
      if (window.scrollY > 0) {
        startYRef.current = null;
        distanceRef.current = 0;
        setPullDistance(0);
        return;
      }

      const damped = Math.min(MAX_PULL, deltaY * DAMPING);
      distanceRef.current = damped;
      setPullDistance(damped);

      // 실제로 당기는 중에만 기본 스크롤 차단(러버밴드 방지)
      if (damped > 5 && e.cancelable) {
        e.preventDefault();
      }
    };

    const finishTouch = () => {
      if (startYRef.current === null) return;
      const d = distanceRef.current;
      startYRef.current = null;
      distanceRef.current = 0;

      if (d >= THRESHOLD) {
        setPullDistance(THRESHOLD);
        setRefreshing(true);
        // 사용자가 스피너를 잠시 본 뒤 reload
        window.setTimeout(() => {
          window.location.reload();
        }, 250);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", finishTouch, { passive: true });
    document.addEventListener("touchcancel", finishTouch, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", finishTouch);
      document.removeEventListener("touchcancel", finishTouch);
    };
  }, [refreshing]);

  const visible = pullDistance > 0 || refreshing;
  const progress = Math.min(1, pullDistance / THRESHOLD);
  const reached = progress >= 1;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-30 pointer-events-none flex justify-center"
      style={{
        transform: `translateY(${visible ? Math.min(pullDistance, MAX_PULL) - 48 : -48}px)`,
        transition:
          refreshing || pullDistance === 0 ? "transform 0.25s ease-out" : "none",
      }}
      aria-hidden={!visible}
    >
      <div
        className="mt-3 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center"
        style={{ opacity: 0.5 + progress * 0.5 }}
      >
        <svg
          className={`w-5 h-5 ${reached || refreshing ? "text-blue-600" : "text-gray-500"} ${refreshing ? "animate-spin" : ""}`}
          style={
            refreshing
              ? undefined
              : {
                  transform: `rotate(${progress * 360}deg)`,
                  transition: "transform 0.05s linear",
                }
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </div>
  );
}
