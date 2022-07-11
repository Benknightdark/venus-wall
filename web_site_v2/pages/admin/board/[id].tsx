import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import useSWR from "swr";
import Loading from "../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import { fetcher } from "../../../utils/fetcherHelper";
import AdminLayout from "../../utils/admin-layout";
import Image from 'next/image'
import { IoArrowBackSharp } from 'react-icons/io5'
import { GrGallery } from 'react-icons/gr'
import { ColumnModel } from "../../../models/columnModel";
import { ColumnSort } from "../../../models/columnSort";
import { useGalleryHook } from '../../../utils/galleryHook';
import Gallery from "../../../components/gallery";
import { imageFetch } from "../../../utils/imageFetchHelper";
import { ToastMessageType, useToast } from "../../../utils/toastMessageHook";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const defaultPageList = [1, 2, 3, 4, 5]
    const [pageList, setPageList] = useState(defaultPageList)
    const [page, setPage] = useState(1)
    const [keyWord, setKeyWord] = useState('');
    const [sortMode, setSortMode] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const toast = useToast();

    const [columnList, setColumnList] = useState<Array<ColumnModel>>([
        {
            displayName: 'Avator', columnName: 'Avator', sort: null, enableSort: false
        },
        {
            displayName: 'Title', columnName: 'Title', sort: null, enableSort: true
        },
        {
            displayName: 'ModifiedDateTime', columnName: 'ModifiedDateTime', sort: null, enableSort: true
        }
    ]);
    const { data: itemData, mutate: itemMutate, error: itemError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/item/table/${id}?offset=${page - 1}&limit=5&keyword=${keyWord}&mode=${sortMode}&sort=${sortColumn}`,
        fetcher)
    const { data: pageTitleData, mutate: pageTitleMutate, error: pageTitleError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/item/page-title/${id}`,
        fetcher)
    const changePage = async (curretnPage: number) => {
        await setPage(curretnPage)
        if (curretnPage >= 5) {
            setPageList([curretnPage - 2, curretnPage - 1, curretnPage, curretnPage + 1, curretnPage + 2])
        } else {
            setPageList(defaultPageList)
        }
        await itemMutate()
    }
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(event.target.value);
        setTimeout(() => event.target.focus(), 500);
    };
    const { openGallery, setGalleryImages, galleryList } = useGalleryHook();
    useEffect(() => {
        adminGlobalStoreMutate({
            ...defaultAdminGlobalStoreData, pageTitle: '看版管理',
            pageDescription: `${pageTitleData?.WebPageForumID_U?.Name}/${pageTitleData?.Name}`
        }, false);
    }, [adminGlobalStoreMutate, pageTitleData])
    if (!itemData) return <Loading></Loading>
    if (itemError) return <Loading></Loading>
    return (
        <div>
            <div className="flex flex-col">

                <div className="flex p-4 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                 justify-between"  role="alert">
                    <button className='monochrome-blue-btn  flex space-x-2'
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <IoArrowBackSharp className='w-4 h-4'></IoArrowBackSharp>
                        回上一頁
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
                                itemMutate();
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
                                itemData && itemData.data.map((f: any) => <tr key={f.key}>
                                    <th className='w-16	'>
                                        <div className="flex flex-l">
                                            <div className="tooltip" data-tip="看更多圖片">
                                                <button className='pill-blue-btn' onClick={async () => {
                                                    const fetchData = await imageFetch(f.ID);
                                                    console.log(fetchData)
                                                    if (fetchData.length > 0) {

                                                        setGalleryImages(fetchData.map((a: any) => a.Url))
                                                        openGallery();
                                                    }else{
                                                        toast.show(true,"沒有任何圖片",ToastMessageType.Error);
                                                    }
                                                }}>
                                                    <GrGallery className="bg-white"></GrGallery></button>
                                            </div>
                                            <div className="tooltip" data-tip="刪除">
                                                <button className='pill-red-btn' onClick={() => {
                                                }}><FiTrash2></FiTrash2></button>
                                            </div>
                                        </div>
                                    </th>
                                    <th>{
                                        f.Avator && <Image
                                            src={f.Avator}
                                            alt={f.Title}
                                            width={50}
                                            height={50}
                                            className="cursor-pointer"
                                            onClick={() => {

                                                setGalleryImages([f.Avator])
                                                openGallery();
                                                console.log(galleryList)
                                            }}
                                        />
                                    }</th>
                                    <th>{f.Title}</th>
                                    <th>{f.ModifiedDateTime}</th>
                                </tr>)
                            }

                        </tbody>
                    </table>
                </div>
                {
                    itemData && <div className="flex justify-center btn-group pt-3">
                        <button className={`btn ${page === 1 ? 'btn-info' : ''}`} onClick={() =>
                            changePage(1)
                        }>1</button>
                        {page >= 5 && <button className="btn btn-disabled">...</button>}
                        {
                            pageList.filter(a => a !== 1 && a < itemData['totalDataCount']).map(a => <button key={a} className={`btn ${page === a ? 'btn-info' : ''}`}
                                onClick={() => changePage(a)
                                }>{a}</button>)
                        }
                        {itemData['totalDataCount'] !== page && <button className="btn btn-disabled">...</button>}
                        <button className={`btn ${page === itemData['totalDataCount'] ? 'btn-info' : ''}`} onClick={() =>
                            changePage(itemData['totalDataCount'])
                        }>{itemData['totalDataCount']}</button>
                    </div>
                }
            </div>
        </div>
    );
}
Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
            <Gallery></Gallery>
        </AdminLayout>
    )
}
export default Index;