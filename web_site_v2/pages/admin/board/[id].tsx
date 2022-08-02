import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import { fetcher } from "../../../utils/fetcherHelper";
import AdminLayout from "../../utils/admin-layout";
import Image from 'next/image'
import { IoArrowBackSharp } from 'react-icons/io5'
import { GrGallery } from 'react-icons/gr'
import { useGalleryHook } from '../../../utils/galleryHook';
import Gallery from "../../../components/gallery";
import { imageFetch } from "../../../utils/imageFetchHelper";
import { useToast } from "../../../utils/toastMessageHook";
import CustomTable from "../../../components/custom-table";
import { defaultTableStore, tableStore } from "../../../stores/table-store";
import { BiLinkExternal } from 'react-icons/bi'
import CrawlerModal from "../../../components/crawler-modal";
import { GiSpiderBot } from "react-icons/gi";
const IndexRow = (props: any) => {
    const toast = useToast();
    const { openGallery, setGalleryImages } = useGalleryHook();
    return <tr id={props.row.ID}>
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
                <div className="tooltip" data-tip="開啟外部網站">

                    <button className='pill-green-btn' onClick={() => {
                        window.open(props.row.Url, '_blank')!.focus();
                    }}>
                        <BiLinkExternal></BiLinkExternal>
                    </button>
                </div>

                <div className="tooltip" data-tip="刪除">
                    <button className='pill-red-btn' onClick={async () => {
                        const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/item/${props.row.ID}`, {
                            method: 'DELETE'
                        })
                        if (req.status === 200) {
                            toast.showSuccess((await req.json())['message']);
                            document.getElementById(props.row.ID)?.remove();
                        } else {
                            toast.showError((await req.text()));
                        }
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
        <th>{props.row.Seq}</th>
    </tr>
}
const Index = () => {
    const router = useRouter();
    const [modalData, setModalData] = useState({ modalTitle: '', selectedId: '' })

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
            },
            {
                displayName: 'Seq', columnName: 'Seq', sort: null, enableSort: true
            },
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
                <button className='monochrome-red-btn  flex space-x-2'
                    onClick={() => {
                        setModalData({ modalTitle: `${pageTitleData?.WebPageForumID_U?.Name}/${pageTitleData?.Name}`, selectedId: id?.toString()! })
                        document.getElementById('crawler-modal-btn')!.click();
                    }}
                >
                    <GiSpiderBot className='w-4 h-4'></GiSpiderBot>
                    執行爬蟲作業
                </button>
            </div>
            <CustomTable row={<IndexRow />}></CustomTable>
            <CrawlerModal modalTitle={modalData.modalTitle} selectedId={modalData.selectedId}></CrawlerModal>

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