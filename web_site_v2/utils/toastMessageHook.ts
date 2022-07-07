import useSWR from "swr"
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store"
export enum ToastMessageType {
    Success,
    Error
}
export const useToast = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    return {
        show: (showToast: boolean, toastMessage: string, toastMessageType: ToastMessageType) => mutateGlobalStoreData({
            ...globalStoreData,
            showToast: showToast, toastMessage: toastMessage, toastMessageType: toastMessageType
        }, false),
        hide: () => mutateGlobalStoreData({
            ...globalStoreData,
            showToast: false, toastMessage: ''
        }, false),
        showToast:globalStoreData.showToast,
        toastMessage:globalStoreData.toastMessage
    }
}