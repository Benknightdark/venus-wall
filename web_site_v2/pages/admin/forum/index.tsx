import { ReactElement, useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admon-global-store";
import AdminLayout from "../../utils/admin-layout";
import { IoIosRefreshCircle } from 'react-icons/io'
import { FaPlusCircle } from 'react-icons/fa'
import { FiEdit, FiSearch, FiTrash2 } from 'react-icons/fi'
import { useRouter } from "next/router";

const fetcher = (url: string) => fetch(url).then(res => res.json())

const Index = () => {
    const router=useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const defaultPageList = [1, 2, 3, 4, 5]
    const [pageList, setPageList] = useState(defaultPageList)
    const [page, setPage] = useState(1)
    const { data: forumData, mutate: forumMutate, error: forumError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/forum-table?offset=${page - 1}&limit=10`,
        fetcher)
    const changePage = async (curretnPage: number) => {
        console.log(curretnPage)
        await setPage(curretnPage)
        if (curretnPage >= 5) {
            setPageList([curretnPage - 2, curretnPage - 1, curretnPage, curretnPage + 1, curretnPage + 2])
        } else {
            setPageList(defaultPageList)
        }
        await forumMutate()
    }
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '管理要爬的論壇網站' }, false)
    })
    if (!forumData) return <Loading></Loading>
    if (forumError) return <Loading></Loading>
    return (
        <div className="flex flex-col">
            <div className="flex p-4 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                 justify-between"  role="alert">
                <button className='monochrome-purple-btn  flex space-x-2'>
                    <FaPlusCircle className='w-4 h-4'></FaPlusCircle>
                    新增
                </button>

                <div>
                    <input type="text" placeholder="關鍵字搜尋" className="input input-bordered input-primary" />
                    <div className="tooltip tooltip-left" data-tip="重新取得資料">
                        <IoIosRefreshCircle className="inline flex-shrink-0 mr-3 w-8 h-8 cursor-pointer hover:h-10 hover:w-10" onClick={() => {
                            setPage(1);
                            forumMutate();
                        }}>
                        </IoIosRefreshCircle>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto ">
                <table className="table w-full ">
                    <thead className=''>
                        <tr>
                            <th className='bg-green-200 w-16'></th>
                            <th className='bg-green-200'>Name</th>
                            <th className='bg-green-200'>CreatedTime</th>
                            <th className='bg-green-200'>WorkerName</th>
                            <th className='bg-green-200'>Enable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            forumData && forumData.data.map((f: any) => <tr key={f.key}>
                                <th className='w-16	'>
                                    <div className="flex flex-l">
                                        <div className="tooltip" data-tip="編輯">
                                            <button className='pill-blue-btn' onClick={()=>{}}>
                                                <FiEdit></FiEdit></button>
                                        </div>
                                        <div className="tooltip" data-tip="檢視">
                                            <button className='pill-green-btn' onClick={()=>{
                                                router.push(`/admin/forum/detail/${f?.ID}`)
                                            }}><FiSearch></FiSearch></button>
                                        </div>
                                        <div className="tooltip" data-tip="刪除">
                                            <button className='pill-red-btn' onClick={()=>{}}><FiTrash2></FiTrash2></button>
                                        </div>
                                    </div>
                                </th>
                                <th>{f.Name}</th>
                                <th>{f.CreatedTime}</th>
                                <th>{f.WorkerName}</th>
                                <th>{f.Enable.toString()}</th>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
            {
                forumData && <div className="flex justify-center btn-group pt-3">
                    <button className={`btn ${page === 1 ? 'btn-info' : ''}`} onClick={() =>
                        changePage(1)
                    }>1</button>
                    {page >= 5 && <button className="btn btn-disabled">...</button>}
                    {
                        pageList.filter(a => a !== 1 && a < forumData['totalDataCount']).map(a => <button key={a} className={`btn ${page === a ? 'btn-info' : ''}`}
                            onClick={() => changePage(a)
                            }>{a}</button>)
                    }
                    {forumData['totalDataCount'] !== page && <button className="btn btn-disabled">...</button>}
                    <button className={`btn ${page === forumData['totalDataCount'] ? 'btn-info' : ''}`} onClick={() =>
                        changePage(forumData['totalDataCount'])
                    }>{forumData['totalDataCount']}</button>
                </div>
            }
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