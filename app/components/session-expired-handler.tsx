'use client';

import { useEffect } from 'react';
import { logout } from '@/app/libs/actions';

export default function SessionExpiredHandler() {
  useEffect(() => {
    // 컴포넌트가 렌더링되면 즉시 logout 액션을 호출합니다.
    logout().catch(console.error);
  }, []);

  // 사용자에게 로딩 중 또는 리디렉션 중임을 알리는 UI를 표시할 수 있습니다.
  return <div>Session expired. Logging out...</div>;
}