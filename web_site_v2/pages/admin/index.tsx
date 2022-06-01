import { useRouter } from "next/router";
import { ReactElement } from "react";
import useSWR from "swr";
import AdminLayout from '../utils/admin-layout';
import { FcRefresh } from 'react-icons/fc'
import { AiOutlineRead } from "react-icons/ai";
const fetcher = (url: string) => fetch(url).then(res => res.json())

const Index = () => {
  const { data: forumCountData, mutate: forumCountMutate, error: forumCountError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/forum-count`,
    fetcher)
  const { data: crawlTaskData, mutate: crawlTaskMutate, error: crawlTaskError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/admin/crawl-task-count`,
    fetcher)
  const router = useRouter();
  console.log(forumCountData)
  console.log(crawlTaskData)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">DashBoard</h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <AiOutlineRead className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"></AiOutlineRead>
              檢視爬蟲工作圖表
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md
             shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none
             focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FcRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500"></FcRefresh>
              重新整理
            </button>
        </div>
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