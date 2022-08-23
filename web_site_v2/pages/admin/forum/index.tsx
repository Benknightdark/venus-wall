import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import AdminLayout from "../../utils/admin-layout";
import React from "react";
import { defaultTableStore, tableStore } from "../../../stores/table-store";
import CustomTable from "../../../components/custom-table";
import { useRouter } from "next/router";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
const IndexRow = (props: any) => {
    const router = useRouter();
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    return <tr>
        <th className='w-16	'>
            <div className="flex flex-l">
                <div className="tooltip" data-tip="編輯">
                    <button className='pill-blue-btn' onClick={() => {
                        router.push(`${tableStoreData?.editUrl}/${props?.row.ID}`)
                    }}>
                        <FiEdit></FiEdit></button>
                </div>
                <div className="tooltip" data-tip="檢視">
                    <button className='pill-green-btn' onClick={() => {
                        router.push(`${tableStoreData?.detailurl}/${props?.row.ID}`)
                    }}><FiSearch></FiSearch></button>
                </div>
                <div className="tooltip" data-tip="刪除">
                    <button className='pill-red-btn' onClick={() => {
                        router.push(`${tableStoreData?.deleteUrl}/${props?.row.ID}`)
                    }}><FiTrash2></FiTrash2></button>
                </div>
            </div>
        </th>
        <th>{props.row.Name}</th>
        <th>{props.row.CreatedTime}</th>
        <th>{props.row.WorkerName}</th>
        <th>{props.row.Enable.toString()}</th>
    </tr>
}

const Index = () => {
    const { t, ready } = useTranslation('common')

    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    const columnNameObject = (t('forum', { returnObjects: true }) as any)['columnName'];
    tableStoreMutate({
        ...tableStoreData!,
        fetchUrl: `${process.env.NEXT_PUBLIC_APIURL}/api/forum-table`,
        columnList: [
            {
                displayName: columnNameObject['name'], columnName: 'Name', sort: null, enableSort: true
            },
            {
                displayName: columnNameObject['createdTime'], columnName: 'CreatedTime', sort: null, enableSort: true
            },
            {
                displayName: columnNameObject['workerName'], columnName: 'WorkerName', sort: null, enableSort: true
            },
            {
                displayName: columnNameObject['enable'], columnName: 'Enable', sort: null, enableSort: false
            },

        ],
        page: 1,
        keyWord: '',
        sortMode: '',
        sortColumn: '',
        createUrl: '/admin/forum/create',
        editUrl: '/admin/forum/edit',
        deleteUrl: '/admin/forum/delete',
        detailurl: '/admin/forum/detail',
    }, false)


    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData,
         pageTitle:(t('forum', { returnObjects: true }) as any)['pageTitle'],
         pageDescription: (t('forum', { returnObjects: true }) as any)['description'] },
          false)
    })
    return (
        <div className="flex flex-col">
            <CustomTable row={<IndexRow></IndexRow>}></CustomTable>
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
export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}
export default Index;