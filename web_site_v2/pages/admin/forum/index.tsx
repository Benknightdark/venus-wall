import { ReactElement, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Loading from "../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import AdminLayout from "../../utils/admin-layout";
import { IoIosRefreshCircle } from 'react-icons/io'
import { FaPlusCircle } from 'react-icons/fa'
import { FiEdit, FiSearch, FiTrash2 } from 'react-icons/fi'
import { useRouter } from "next/router";
import { fetcher } from "../../../utils/fetcherHelper";
import { HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi'
enum ColumnSort {
    ASC,
    DESC
}
class ColumnModel {
    displayName: string = '';
    columnName: string = '';
    sort: ColumnSort | null = null;
    enableSort: boolean = true;
}

const Index = () => {
    const router = useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const defaultPageList = [1, 2, 3, 4, 5]
    const [pageList, setPageList] = useState(defaultPageList)
    const [page, setPage] = useState(1)
    const [keyWord, setKeyWord] = useState('');
    const [sortMode,setSortMode]=useState('');
    const [sortColumn,setSortColumn]=useState('');
    const [columnList, setColumnList] = useState<Array<ColumnModel>>([
        {
            displayName: 'Name', columnName: 'Name', sort: null, enableSort: true
        },
        {
            displayName: 'CreatedTime', columnName: 'CreatedTime', sort: null, enableSort: true
        },
        {
            displayName: 'WorkerName', columnName: 'WorkerName', sort: null, enableSort: true
        },
        {
            displayName: 'Enable', columnName: 'Enable', sort: null, enableSort: false
        },

    ]);
    const { data: forumData, mutate: forumMutate, error: forumError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/forum-table?offset=${page - 1}&limit=10&keyword=${keyWord}&mode=${sortMode}&sort=${sortColumn}`,
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

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
        setTimeout(() => event.target.focus(), 500);
    };

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '管理要爬的論壇網站' }, false)
        if (keyWord != '')
            document.getElementById('keyWordInput')?.focus();
    })
    if (!forumData) return <Loading></Loading>
    if (forumError) return <Loading></Loading>
    return (
        <div className="flex flex-col">
            <div className="flex p-4 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                 justify-between"  role="alert">
                <button className='monochrome-purple-btn  flex space-x-2'
                    onClick={() => {
                        router.push('/admin/forum/create')
                    }}
                >
                    <FaPlusCircle className='w-4 h-4'></FaPlusCircle>
                    新增
                </button>

                <div>
                    <input type="text" placeholder="關鍵字搜尋" className="input input-bordered input-primary"
                        id='keyWordInput'
                        onChange={onChangeHandler}
                        value={keyWord!}
                    />
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
                            {
                                columnList.map(c => <th key={c.columnName} className='bg-green-200 cursor-pointer select-none	'
                                    onClick={() => {
                                        if (c.enableSort) {
                                            if (c.sort === null) {
                                                console.log("desc")
                                                c.sort = ColumnSort.DESC
                                            } else if (c.sort === ColumnSort.DESC) {
                                                console.log("ASC")
                                                c.sort = ColumnSort.ASC

                                            } else {
                                                console.log("DESC")
                                                c.sort = ColumnSort.DESC

                                            }
                                            columnList.filter(f => f.columnName !== c.columnName).map(m => m.sort = null)!
                                            setColumnList([...columnList]);
                                            setSortColumn(c.displayName);
                                            setSortMode( ColumnSort[c.sort])
                                        }
                                    }}
                                >
                                    <div className="flex  space-x-2">
                                        <div>{c.displayName}</div>
                                        {c.enableSort && c.sort !== null && <div>
                                            {
                                                c.sort == ColumnSort.DESC && <HiOutlineSortDescending className="w-5 h-5"></HiOutlineSortDescending>
                                            }

                                            {
                                                c.sort == ColumnSort.ASC && <HiOutlineSortAscending className="w-5 h-5"></HiOutlineSortAscending>
                                            }

                                        </div>}
                                    </div>
                                </th>)
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            forumData && forumData.data.map((f: any) => <tr key={f.key}>
                                <th className='w-16	'>
                                    <div className="flex flex-l">
                                        <div className="tooltip" data-tip="編輯">
                                            <button className='pill-blue-btn' onClick={() => {
                                                router.push(`/admin/forum/edit/${f?.ID}`)
                                            }}>
                                                <FiEdit></FiEdit></button>
                                        </div>
                                        <div className="tooltip" data-tip="檢視">
                                            <button className='pill-green-btn' onClick={() => {
                                                router.push(`/admin/forum/detail/${f?.ID}`)
                                            }}><FiSearch></FiSearch></button>
                                        </div>
                                        <div className="tooltip" data-tip="刪除">
                                            <button className='pill-red-btn' onClick={() => {
                                                router.push(`/admin/forum/delete/${f?.ID}`)

                                            }}><FiTrash2></FiTrash2></button>
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