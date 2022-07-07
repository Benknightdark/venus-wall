import { ReactElement, useEffect } from 'react';
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../stores/admin-global-store";
import AdminLayout from '../utils/admin-layout';
import * as Highcharts from 'highcharts';
import Loading from '../../components/loading';
import uniqolor from 'uniqolor';
import { fetcher } from '../../utils/fetcherHelper';


const Chart = (props: any) => <div id={props.id}></div>
const Index = () => {
  const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
    { fallbackData: defaultAdminGlobalStoreData })

  const { data: forumCountData, mutate: forumCountMutate, error: forumCountError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/forum-count`,
    fetcher)
  const { data: crawlTaskData, mutate: crawlTaskMutate, error: crawlTaskError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/crawl-task-count`,
    fetcher)
  const intCharts = () => {
    forumCountData?.map((f: any) => {
      Highcharts.chart(f.forumName, {
        chart: {
          type: 'bar'
        },
        title: {
          text: `${f.forumName} 文章數量`
        },
        xAxis: {
          categories: f.data.map((d: any) => d.Name)
        },
        yAxis: {
          title: {
            text: '文章數量'
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
          name: `${f.forumName}`,
          type: 'bar',
          data: f.data.map((d: any) => {
            const color = uniqolor(d.TotalCount)
            return {
              y: d.TotalCount,
              color: color.color
            }
          }),
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.0f} 筆', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
            }
          }
        }],
        tooltip: {
          pointFormat: '【{point.series.name}】文章數量： <b>{point.y:.1f}</b>'
        },
        credits: {
          enabled: false
        }
      });
    })
  }
  useEffect(() => {
    adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: 'DashBoard', pageDescription: '檢視系統資料圖表' }, false)

    setTimeout(() => intCharts(), 1000)
  })
  if (!forumCountData || !crawlTaskData) return <Loading></Loading>
  if (forumCountError || crawlTaskError) return <Loading></Loading>

  return (
    <div>
      <div className='flex flex-wrap pb-5 items-center justify-center  space-x-3'>
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-blue-200 text-black-content">
          {
            forumCountData && forumCountData.map((c: any) => <div key={`${c.ForumName}-count`} className="stat">
              <div className="stat-title">{c.forumName}</div>
              <div className="stat-value">{c.totalCount}</div>
              <div className="stat-desc">文章總數</div>
            </div>)
          }
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-green-200 text-black-content">
          {
            crawlTaskData && crawlTaskData.map((c: any) => <div key={`${c.ForumName}-crawler`} className="stat">
              <div className="stat-title">{c.ForumName}</div>
              <div className="stat-value">{c.TotalCount}</div>
              <div className="stat-desc">爬蟲執行次數</div>
            </div>)
          }
        </div>

      </div>
      <div className='flex flex-col sm:space-y-3 lg:space-y-0 lg:flex-row lg:space-x-3  items-center justify-center flex-wrap'>
        {
          forumCountData && forumCountData.map((f: any) => <Chart key={f.forumName} id={f.forumName}></Chart>)
        }
      </div>
    </div>
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