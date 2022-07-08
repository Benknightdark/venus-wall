import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from 'react';
import useSWR from "swr";
import Loading from "../../../components/loading";
import { ColumnModel } from "../../../models/ColumnModel";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import { fetcher } from "../../../utils/fetcherHelper";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;
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
        `${process.env.NEXT_PUBLIC_APIURL}/api/item/table/${id}?offset=${page - 1}&limit=10&keyword=${keyWord}&mode=${sortMode}&sort=${sortColumn}`,
        fetcher)
    useEffect(()=>{
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '看版管理', pageDescription: '管理看版裡的圖片' }, false);
        console.log(itemData)
    })
    if (!itemData) return <Loading></Loading>
    if (itemError) return <Loading></Loading>
    return (
        <div>
            {id}
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