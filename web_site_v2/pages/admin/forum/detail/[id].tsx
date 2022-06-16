import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admon-global-store";
import AdminLayout from "../../../utils/admin-layout";
import { GoGlobe } from "react-icons/go"
const fetcher = (url: string) => fetch(url).then(res => res.json())

const Detail = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const { data: webPageData, mutate: webPageMutate, error: webPageError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/webpage/byForum/${id}`,
        fetcher)
    const { data: forumData, mutate: forumMutate, error: forumError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/forum/${id}`,
        fetcher)
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇明細', pageDescription: '查看論壇明細資料' }, false)
    })
    if (!webPageData && !forumData) return <Loading></Loading>
    if (webPageError && forumError) return <Loading></Loading>
    return (
        <div className="flex flex-col space-y-2 ">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    {<h3 className="text-lg leading-6 font-medium text-gray-900">{forumData[0]['Name']}</h3>}
                    {<p className="mt-1 max-w-2xl text-sm text-gray-500">建立時間：{forumData[0]['CreatedTime']}</p>}
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">WorkerName</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData[0]['WorkerName']}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Seq</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData[0]['Seq']}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Enable</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">

                                <input type="checkbox" className="toggle" disabled checked={forumData[0]['Enable']} />

                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">WebPages</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {
                                        webPageData && webPageData.map((w: any) => <li
                                            key={w.ID}
                                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                {/* <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                            </svg> */}
                                                <GoGlobe className="flex-shrink-0 h-5 w-5 text-gray-400"></GoGlobe>

                                                <span className="ml-2 flex-1 w-0 truncate"> {w.Name} </span>
                                            </div>

                                            <div className="ml-4 flex-shrink-0">
                                                <Link href={`/board/${w.ID}`}
                                                    className="font-medium text-indigo-600 hover:text-indigo-500">
                                                    <a> See More </a>
                                                </Link>

                                            </div>
                                        </li>)
                                    }

                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className=' flex flex-row items-center  justify-center space-x-2'>
                <button className="btn btn-active btn-primary" onClick={router.back}>編輯</button>
                <button className="btn btn-active" onClick={router.back}>回上頁</button>
            </div>
        </div>

    );
}
Detail.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Detail;