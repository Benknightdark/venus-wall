import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import AdminLayout from "../../utils/admin-layout";
import React from "react";
import { defaultTableStore, tableStore } from "../../../stores/table-store";
import CustomTable from "../../../components/custom-table";
import { IndexRow } from "../../../components/forum/componets/index-row";



const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    tableStoreMutate({
        ...tableStoreData!,
        fetchUrl: `${process.env.NEXT_PUBLIC_APIURL}/api/forum-table`,
        columnList: [
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
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '管理要爬的論壇網站' }, false)
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
export default Index;