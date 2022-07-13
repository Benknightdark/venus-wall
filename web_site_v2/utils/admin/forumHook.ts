import useSWR from "swr"
import { fetcher } from "../fetcherHelper"

export const useForum = (id: string) => {
    const { data: webPageData, mutate: webPageMutate, error: webPageError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/webpage/byForum/${id}`,
        
        fetcher,{revalidateOnFocus:false })
    const { data: forumData, mutate: forumMutate, error: forumError } = useSWR(
        `${process.env.NEXT_PUBLIC_APIURL}/api/forum/${id}`,
        fetcher,{revalidateOnFocus:false })
    return {
        webPageData: webPageData,
        webPageMutate: webPageMutate,
        webPageError: webPageError,
        forumData: forumData,
        forumMutate: forumMutate,
        forumError: forumError
    }
}