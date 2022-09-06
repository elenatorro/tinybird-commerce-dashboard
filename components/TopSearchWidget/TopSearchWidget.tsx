import Widget from '../Widget'
import TopSearchChart from './TopSearchChart'
import useTopSearch from '../../lib/hooks/use-top-search'

export default function TopSearchWidget() {
  const { data, status, warning } = useTopSearch()

  return (
    <Widget height={472}>
      <Widget.Title className="mb-6">Top Search</Widget.Title>
      <Widget.Content className="flex flex-col" status={status}>
        {!!data && !warning ? (
          <TopSearchChart {...data} />
        ) : (
          <Widget.NoData />
        )}
        {!!warning && <Widget.Warning>{warning.message}</Widget.Warning>}
      </Widget.Content>
    </Widget>
  )
}
