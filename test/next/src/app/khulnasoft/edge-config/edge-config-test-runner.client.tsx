'use client';

import dynamic from 'next/dynamic';
import type { TestRunnerProps } from '@/lib/test/postgres';
import type { ReactElement } from 'react';

const EdgeConfigTestRunner = dynamic(
  () =>
    import('@/lib/test/edge-config').then((mod) => mod.EdgeConfigTestRunner),
  { ssr: false },
);

export function EdgeConfigTestRunnerClient(
  props: TestRunnerProps,
): ReactElement {
  return <EdgeConfigTestRunner {...props} />;
}
