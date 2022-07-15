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
import { useToast } from "../../../utils/toastMessageHook";
import CustomTable from "../../../components/custom-table";
import { defaultTableStore, tableStore } from "../../../stores/table-store";
const IndexRow = (props: any) => {
    const toast = useToast();
    const { openGallery, setGalleryImages, galleryList } = useGalleryHook();
    return <tr>
        <th className='w-16	'>
            <div className="flex flex-l">
                <div className="tooltip" data-tip="看更多圖片">
                    <button className='pill-blue-btn' onClick={async () => {
                        const fetchData = await imageFetch(props.row.ID);
                        if (fetchData.length > 0) {
                            setGalleryImages(fetchData.map((a: any) => a.Url))
                            openGallery();
                        } else {
                            toast.showError("沒有任何圖片");
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
            props.row.Avator && <Image
                src={props.row.Avator}
                alt={props.row.Title}
                width={50}
                height={50}
                className="cursor-pointer"
                onClick={() => {
                    setGalleryImages([props.row.Avator])
                    openGallery();
                }}
            />
        }</th>
        <th>{props.row.Title}</th>
        <th>{props.row.ModifiedDateTime}</th>
    </tr>
}
const Index = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    tableStoreMutate({
        ...tableStoreData!,
        fetchUrl: `${process.env.NEXT_PUBLIC_APIURL}/api/item/table/${id}`,
        columnList: [
            {
                displayName: 'Avator', columnName: 'Avator', sort: null, enableSort: false
            },
            {
                displayName: 'Title', columnName: 'Title', sort: null, enableSort: true
            },
            {
                displayName: 'ModifiedDateTime', columnName: 'ModifiedDateTime', sort: null, enableSort: true
            }
        ],
        page: 1,
        keyWord: '',
        sortMode: '',
        sortColumn: '',
        createUrl: ''
    }, false)

    const { data: pageTitleData, mutate: pageTitleMutate, error: pageTitleError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/item/page-title/${id}`,
        fetcher)

    useEffect(() => {
        adminGlobalStoreMutate({
            ...defaultAdminGlobalStoreData, pageTitle: '看版管理',
            pageDescription: `${pageTitleData?.WebPageForumID_U?.Name}/${pageTitleData?.Name}`
        }, false);
    }, [adminGlobalStoreMutate, pageTitleData])

    return (
        <div className="flex flex-col">
            <div className='flex flex-row'>
                <button className='monochrome-blue-btn  flex space-x-2'
                    onClick={() => {
                        router.back();
                    }}
                >
                    <IoArrowBackSharp className='w-4 h-4'></IoArrowBackSharp>
                    回上一頁
                </button>
            </div>
            <CustomTable row={<IndexRow />}></CustomTable>            
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