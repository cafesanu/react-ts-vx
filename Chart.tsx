import React from 'react';
import { appleStock } from '@vx/mock-data';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { AreaClosed } from '@vx/shape';
import { Group } from '@vx/group';

const data = appleStock;
const width = 900;
const height = 400;
const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;
const y = (d) => d.close;
const x = (d) => new Date(d.date); // d.date is unix timestamps


export const Chart = () => {

  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x)
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)],
  });
  const chart = (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <AreaClosed
          data={data}
          xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
          fill={"red"}
        />
      </Group>
    </svg>
)
  return (
    <h1>In progress...</h1>
  );
};
