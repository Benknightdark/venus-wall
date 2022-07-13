import useSWR from "swr"
import { MessageType } from "../models/MessageType"
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store"

export const useModal = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    return {

        showSuccess: (modalMessage: string) => {
            mutateGlobalStoreData({
                ...globalStoreData,
                showModal: true, modalMessage: modalMessage, modalMessageType: MessageType.Success
            }, false);
        },
        showError: (modalMessage: string) => {
            mutateGlobalStoreData({
                ...globalStoreData,
                showModal: true, modalMessage: modalMessage, modalMessageType: MessageType.Error
            }, false);
        },
        showModal: globalStoreData.showModal,
        modalMessage: globalStoreData.modalMessage,
        modalMessageType:globalStoreData.modalMessageType
    }
}