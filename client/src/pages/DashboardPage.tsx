import React from 'react';
import { DynamicChart } from '../components/DynamicChart';
import { sampleChartConfig } from '../schemas/chartConfig';
import { DynamicLayout } from '../components/DynamicLayout';

export function DashboardPage() {
  return (
    <DynamicLayout title="Dashboard">
      <DynamicChart config={sampleChartConfig} />
    </DynamicLayout>
  );
}
