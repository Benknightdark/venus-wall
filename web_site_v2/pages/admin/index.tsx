import { ReactElement, useEffect } from 'react';
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../stores/admon-global-store";
import AdminLayout from '../utils/admin-layout';
import * as Highcharts from 'highcharts';
const fetcher = (url: string) => fetch(url).then(res => res.json())

const Index = () => {
  const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
    { fallbackData: defaultAdminGlobalStoreData })
  const { data: forumCountData, mutate: forumCountMutate, error: forumCountError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/forum-count`,
    fetcher)
  const { data: crawlTaskData, mutate: crawlTaskMutate, error: crawlTaskError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/crawl-task-count`,
    fetcher)
  const intCharts = () => {
    Highcharts.chart("chart", {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Monthly Average Temperature'
      },
      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [{
        name: 'Tokyo',
        type: 'bar',
        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }]
    });
  }
  useEffect(() => {
    adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: 'DashBoard', pageDescription: '檢視系統資料圖表' }, false)

    console.log(forumCountData)
    intCharts();

  }, [])
  return (
    <div id='chart'></div>
  );
}
Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      {page}
    </AdminLayout>
  )
}
export default Index;