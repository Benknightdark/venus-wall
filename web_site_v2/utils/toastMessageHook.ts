import useSWR from "swr"
import { MessageType } from "../models/MessageType"
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store"

export const useToast = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    return {
        show: (showToast: boolean, toastMessage: string, toastMessageType: MessageType) => mutateGlobalStoreData({
            ...globalStoreData,
            showToast: showToast, toastMessage: toastMessage, toastMessageType: toastMessageType
        }, false),
        hide: () => mutateGlobalStoreData({
            ...globalStoreData,
            showToast: false, toastMessage: ''
        }, false),
        showSuccess:(toastMessage:string)=> mutateGlobalStoreData({
            ...globalStoreData,
            showToast: true, toastMessage: toastMessage, toastMessageType: MessageType.Success
        }, false),
        showError:(toastMessage:string)=> mutateGlobalStoreData({
            ...globalStoreData,
            showToast: true, toastMessage: toastMessage, toastMessageType: MessageType.Error
        }, false),
        showToast:globalStoreData.showToast,
        toastMessage:globalStoreData.toastMessage,
        toastMessageType:globalStoreData.toastMessageType
    }
}