import { Fragment } from 'react'
import { cx, formatNumber } from '../../lib/utils'
import { TopSearch } from '../../lib/types/top-search'
import useBarChart from '../../lib/hooks/use-bar-chart'

type TopSearchChartProps = {
  hits: number[]
  values: string[]
  data: TopSearch[]
}

export default function TopSearchChart({
  data,
  hits,
  values
}: TopSearchChartProps) {
  const ref = useBarChart(hits, values)

  return (
    <>
      <div className="grid gap-x-4 mb-4 grid-cols-[4fr,1fr]">
        <div className="text-xs tracking-widest font-medium uppercase text-left truncate">
          Values
        </div>
        <div className="text-xs tracking-widest font-medium uppercase truncate text-right hover:text-primary">
          Searchs
        </div>
      </div>
      <div className="grid gap-y-1 gap-x-4 relative grid-cols-[2fr,1fr] sm:grid-cols-[4fr,1fr]">
        {data.map(({ value, hits }) => {
          return (
            <Fragment key={value}>
              <div className='flex items-center text-sm leading-5 text-primary h-9 px-4 py-2 rounded-md z-10 overflow-hidden'>
                <span className="truncate">{value}</span>
              </div>
              <div className="flex items-center justify-end text-neutral-64 h-9">
                {formatNumber(hits)}
              </div>
            </Fragment>
          )
        })}
        <div className="grid gap-y-1 gap-x-4 absolute inset-0 z-0 grid-cols-2 sm:grid-cols-[4fr,1fr]">
          <div className="w-full h-full" ref={ref} />
        </div>
      </div>
    </>
  )
}
