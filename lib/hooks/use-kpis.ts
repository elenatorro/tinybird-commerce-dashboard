import { useRouter } from 'next/router'
import moment from 'moment'

import { queryPipe } from '../api'
import { KpisData, KpiType, isKpi } from '../types/kpis'
import useDateFilter from './use-date-filter'
import useQuery from './use-query'
import { ChartValue } from '../types/charts'

const arrayHasCurrentDate = (dates: string[], isHourlyGranularity: boolean) => {
  const now = moment()
    .utc()
    .format(isHourlyGranularity ? 'HH:00' : 'MMM DD, YYYY')
  return dates[dates.length - 1] === now
}

async function getKpis(kpi: KpiType, date_from?: string, date_to?: string) {
  const { data: queryData } = await queryPipe<KpisData>('kpis', {
    date_from,
    date_to,
  })
  const isHourlyGranularity = !!date_from && !!date_to && date_from === date_to
  const dates = queryData.map(({ date }) =>
    moment(date).format(isHourlyGranularity ? 'HH:mm' : 'MMM DD, YYYY')
  )
  const isCurrentData = arrayHasCurrentDate(dates, isHourlyGranularity)

  const data = isCurrentData
    ? queryData.reduce(
        (acc, record, index) => {
          const value = record[kpi] ?? 0

          const pastValue = index < queryData.length - 1 ? value : ''
          const currentValue = index > queryData.length - 3 ? value : ''

          const [pastPart, currentPart] = acc

          return [
            [...pastPart, pastValue],
            [...currentPart, currentValue],
          ]
        },
        [[], []] as ChartValue[][]
      )
    : [queryData.map(value => value[kpi] ?? 0), ['']]

  return {
    dates,
    data,
  }
}

export default function useKpis() {
  const { startDate, endDate } = useDateFilter()
  const router = useRouter()
  const { kpi: kpiParam } = router.query
  const kpi = isKpi(kpiParam) ? kpiParam : 'visits'
  const query = useQuery([kpi, startDate, endDate, 'kpis'], getKpis)

  const setKpi = (kpi: KpiType) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('kpi', kpi)
    router.push(
      {
        query: searchParams.toString(),
      },
      undefined,
      { scroll: false }
    )
  }

  return {
    setKpi,
    kpi,
    ...query,
  }
}
