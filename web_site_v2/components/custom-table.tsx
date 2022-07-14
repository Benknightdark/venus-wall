import { useState } from "react";
import useSWR from "swr";
import { ColumnModel } from "../models/columnModel";
import { defaultTableStore, tableStore } from "../stores/table-store";
import { fetcher } from "../utils/fetcherHelper";

const CustomTable = (props: any) => {
    const { data: tableStoreData, mutate: tableStoreMutate } = useSWR(tableStore,
        { fallbackData: defaultTableStore });
    const defaultPageList = [1, 2, 3, 4, 5]
    const [pageList, setPageList] = useState(defaultPageList)
    const [page, setPage] = useState(tableStoreData?.page)
    const [keyWord, setKeyWord] = useState(tableStoreData?.keyWord);
    const [sortMode, setSortMode] = useState(tableStoreData?.sortMode);
    const [sortColumn, setSortColumn] = useState(tableStoreData?.sortColumn);
    const [columnList, setColumnList] = useState<Array<ColumnModel>>(tableStoreData?.columnList!);
    const { data: forumData, mutate: forumMutate, error: forumError } = useSWR(
        `${tableStoreData?.fetchUrl}?offset=${page! - 1}&limit=10&keyword=${keyWord}&mode=${sortMode}&sort=${sortColumn}`,
        fetcher)
    return (
        <div>
            Enter
        </div>
    );
}

export default CustomTable;