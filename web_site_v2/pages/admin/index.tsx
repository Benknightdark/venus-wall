import { useRouter } from "next/router";
import { ReactElement } from "react";
import useSWR from "swr";
import AdminLayout from '../utils/admin-layout';
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