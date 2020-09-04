import React, { useMemo, useCallback, useState } from 'react';
import { AreaClosed, Line, Bar } from '@vx/shape';
import appleStock, { AppleStock } from '@vx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@vx/curve';
import { GridRows, GridColumns } from '@vx/grid';
import { scaleTime, scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@vx/tooltip';
import { WithTooltipProvidedProps } from '@vx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@vx/event';
import { LinearGradient } from '@vx/gradient';
import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { random } from 'faker';

type TooltipData = AppleStock;
const random0to60 = () => random.number({ min: 0, max: 60 });

const stockFn = (i: number) => {
  const ii = i + 1;
  const date = ii < 10 ? `0${ii}`: `${ii}`;

  return {
    date: `2007-03-${date}T07:00:00.000Z`,
    close: random0to60()
  }
};;

const generateSingleStock = (num = 12) => {
  return [...Array(num)]
      .fill(1)
      .map((_, i) => stockFn(i));
}

const generateStock = (num = 12) => ([
  generateSingleStock(num),
  generateSingleStock(num),
  generateSingleStock(num),
  generateSingleStock(num)
])
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#ccc';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>(d => new Date(d.date)).left;

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;
    const [data, setData] = useState(generateStock());

  console.log(data[0]);

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [0, xMax],
          domain: extent(data[0], getDate) as [Date, Date],
        }),
      [xMax],
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [yMax, 0],
          domain: [0, (max(data[0], getStockValue) || 0) + yMax / 3],
          nice: true,
        }),
      [yMax],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(data[0], x0, 1);
        const d0 = data[0][index - 1];
        const d1 = data[0][index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale],
    );

    return (
      <div>
        <h1>VX</h1>
        <button
          style={{ marginRight: '5px' }}
          onClick={() => {
            setData(generateStock(12));
          }}
        >
          12 points (for months)
        </button>
        <button
          style={{ marginRight: '5px' }}
          onClick={() => {
            setData(generateStock(24));
          }}
        >
          24 points (for day)
        </button>
        <button
          style={{ marginRight: '5px' }}
          onClick={() => {
            setData(generateStock(31));
          }}
        >
          31 points (for month)
        </button>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#fff"
            rx={14}
          />
          <GridRows
            scale={stockValueScale}
            width={xMax}
            strokeDasharray="3,3"
            stroke={accentColor}
            strokeOpacity={1}
            pointerEvents="none"
          />
          <GridColumns
            scale={dateScale}
            height={yMax}
            strokeDasharray="3,3"
            stroke={accentColor}
            strokeOpacity={0.3}
            pointerEvents="none"
          />
          <AreaClosed<AppleStock>
            data={data[0]}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockValue(d))}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="#45227B"
            fill="#45227B"
          />

          <AreaClosed<AppleStock>
            data={data[1]}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockValue(d))}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="#45227B"
            fill="#6E36C5"
          />

          <AreaClosed<AppleStock>
            data={data[2]}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockValue(d))}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="#45227B"
            fill="#8A43F6"
          />

          <AreaClosed<AppleStock>
            data={data[3]}
            x={d => dateScale(getDate(d))}
            y={d => stockValueScale(getStockValue(d))}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="#45227B"
            fill="#A06DEE"
          />
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <Tooltip top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
              {`$${getStockValue(tooltipData)}`}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
