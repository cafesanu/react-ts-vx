import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@vx/responsive/lib/components/ParentSize';

import Chart from './Chart';
import './style.css';

render(
  <ParentSize>{({ width, height }) => <Chart width={width} height={400} />}</ParentSize>,
  document.getElementById('root'),
);
