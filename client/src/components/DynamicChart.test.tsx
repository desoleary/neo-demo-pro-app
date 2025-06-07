import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DynamicChart } from './DynamicChart';
import { sampleChartConfig } from '../schemas/chartConfig';

describe('DynamicChart', () => {
  it('renders canvas element', () => {
    render(<DynamicChart config={sampleChartConfig} />);
    expect(screen.getByLabelText('chart')).toBeInTheDocument();
  });
});
