import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import AdminLayout from "../../../utils/admin-layout";
import { GoGlobe } from "react-icons/go"
import { useForum } from "../../../../utils/admin/forumHook";

const Detail = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const { webPageData, webPageMutate, webPageError, forumData, forumMutate, forumError } = useForum(id?.toString()!);
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '明細頁面' }, false)
    })
    if (!webPageData && !forumData) return <Loading></Loading>
    if (webPageError && forumError) return <Loading></Loading>
    return (
        <div className="flex flex-col space-y-2 ">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    {<h3 className="text-lg leading-6 font-medium text-gray-900">{forumData['Name']}</h3>}
                    {<p className="mt-1 max-w-2xl text-sm text-gray-500">建立時間：{forumData['CreatedTime']}</p>}
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">WorkerName</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData['WorkerName']}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Seq</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData['Seq']}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Enable</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input type="checkbox" className="toggle" disabled checked={forumData['Enable']} />
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
                <button className="btn btn-active btn-primary" onClick={() => { router.push(`/admin/forum/edit/${id}`) }}>編輯</button>
                <button className="btn btn-active" onClick={router.back}>返回</button>
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