import { useRouter } from "next/router";
import { ReactNode, useEffect, useState,cloneElement } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import useSWR from "swr";
import { ColumnModel } from "../models/columnModel";
import { ColumnSort } from "../models/columnSort";
import { defaultTableStore, tableStore } from "../stores/table-store";
import { fetcher } from "../utils/fetcherHelper";
import Loading from "./loading";

const CustomTable = (props:any) => {
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    const defaultPageList = [1, 2, 3, 4, 5]
    const [pageList, setPageList] = useState(defaultPageList)
    const [page, setPage] = useState(tableStoreData?.page)
    const [keyWord, setKeyWord] = useState(tableStoreData?.keyWord);
    const [sortMode, setSortMode] = useState(tableStoreData?.sortMode);
    const [sortColumn, setSortColumn] = useState(tableStoreData?.sortColumn);
    const [columnList, setColumnList] = useState<Array<ColumnModel>>(tableStoreData?.columnList!);
    const { data: tableResData, mutate: tableResMutate, error: tableResError } = useSWR(
        `${tableStoreData?.fetchUrl}?offset=${page! - 1}&limit=10&keyword=${keyWord}&mode=${sortMode}&sort=${sortColumn}`,
        fetcher)
    const router = useRouter();
    const changePage = async (curretnPage: number) => {
        await setPage(curretnPage)
        if (curretnPage >= 5) {
            setPageList([curretnPage - 2, curretnPage - 1, curretnPage, curretnPage + 1, curretnPage + 2])
        } else {
            setPageList(defaultPageList)
        }
        await tableResMutate()
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
        setTimeout(() => event.target.focus(), 500);
    };
    useEffect(() => {
        if (keyWord != '')
            document.getElementById('keyWordInput')?.focus();
    })
    if (!tableResData) return <Loading></Loading>
    if (tableResError) return <Loading></Loading>
    return (
        <>
            <div className="flex p-4 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                 justify-between"  role="alert">
                {tableStoreData?.createUrl !== '' && <button className='monochrome-purple-btn  flex space-x-2'
                    onClick={() => {
                        router.push('/admin/forum/create')
                    }}
                >
                    <FaPlusCircle className='w-4 h-4'></FaPlusCircle>
                    新增
                </button>}

                <div>
                    <input type="text" placeholder="關鍵字搜尋" className="input input-bordered input-primary"
                        id='keyWordInput'
                        onChange={onChangeHandler}
                        value={keyWord!}
                    />
                    <div className="tooltip tooltip-left" data-tip="重新取得資料">
                        <IoIosRefreshCircle className="inline flex-shrink-0 mr-3 w-8 h-8 cursor-pointer hover:h-10 hover:w-10"
                            onClick={() => {
                                setPage(1);
                                tableResMutate();
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
                                            setSortMode(ColumnSort[c.sort])
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
                            tableResData && tableResData.data.map((f: any) => <tr key={f.key}>
                                <th className='w-16	'>
                                    <div className="flex flex-l">                                                                                              
                                    {cloneElement(props.row, {ID: f.ID})}
                                    </div>
                                </th>
                                {
                                    tableStoreData?.columnList.map(c=>
                                    <th key={c.columnName}>{f[c.columnName]}</th>
                                    )
                                }
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
            {
                tableResData && <div className="flex justify-center btn-group pt-3">
                    <button className={`btn ${page === 1 ? 'btn-info' : ''}`} onClick={() =>
                        changePage(1)
                    }>1</button>
                    {page! >= 5 && <button className="btn btn-disabled">...</button>}
                    {
                        pageList.filter(a => a !== 1 && a < tableResData['totalDataCount']).map(a => <button key={a}
                            className={`btn ${page === a ? 'btn-info' : ''}`}
                            onClick={() => changePage(a)
                            }>{a}</button>)
                    }
                    {tableResData['totalDataCount'] !== page && <button className="btn btn-disabled">...</button>}
                    <button className={`btn ${page === tableResData['totalDataCount'] ? 'btn-info' : ''}`} onClick={() =>
                        changePage(tableResData['totalDataCount'])
                    }>{tableResData['totalDataCount']}</button>
                </div>
            }
        </>
    );
}

export default CustomTable;