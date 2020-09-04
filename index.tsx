import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@vx/responsive/lib/components/ParentSize';

import Chart from './Chart';

render(
  <ParentSize>{({ width, height }) => <Chart width={width} height={height} />}</ParentSize>,
  document.getElementById('root'),
);
