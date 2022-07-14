import { useRouter } from "next/router";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi"
import useSWR from "swr";
import { defaultTableStore, tableStore } from "../../../stores/table-store";

export const IndexRow = (props: any) => {
    const router = useRouter();
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    return <>
        <div className="tooltip" data-tip="編輯">
            <button className='pill-blue-btn' onClick={() => {
                router.push(`${tableStoreData?.editUrl}/${props?.ID}`)
            }}>
                <FiEdit></FiEdit></button>
        </div>
        <div className="tooltip" data-tip="檢視">
            <button className='pill-green-btn' onClick={() => {
                router.push(`${tableStoreData?.detailurl}/${props?.ID}`)
            }}><FiSearch></FiSearch></button>
        </div>
        <div className="tooltip" data-tip="刪除">
            <button className='pill-red-btn' onClick={() => {
                router.push(`${tableStoreData?.deleteUrl}/${props?.ID}`)
            }}><FiTrash2></FiTrash2></button>
        </div>
    </>
}