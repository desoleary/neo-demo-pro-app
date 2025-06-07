import { ChartConfiguration } from 'chart.js/auto';

export const sampleChartConfig: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Demo',
        data: [3, 7, 4],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  },
};
