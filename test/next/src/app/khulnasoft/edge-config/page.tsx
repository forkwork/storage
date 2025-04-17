import { Suspense } from 'react';
import { ProjectDashboardLayout } from '@/lib/test/project-dashboard-layout';
import { EdgeConfigTestRunnerClient } from './edge-config-test-runner.client';
import type { TestRunnerProps } from '@/lib/test/postgres';

export default function Page(): React.JSX.Element {
  const tests: TestRunnerProps[] = [
    {
      apiOrPage: 'page',
      connectionType: 'client',
      directory: 'app',
      environment: 'edge',
    },
    {
      apiOrPage: 'page',
      connectionType: 'client',
      directory: 'app',
      environment: 'node',
    },
  ];

  return (
    <ProjectDashboardLayout>
      {tests.map((matrix) => (
        <Suspense fallback={<pre>Loading...</pre>} key={JSON.stringify(matrix)}>
          <EdgeConfigTestRunnerClient {...matrix} />
        </Suspense>
      ))}
    </ProjectDashboardLayout>
  );
}
