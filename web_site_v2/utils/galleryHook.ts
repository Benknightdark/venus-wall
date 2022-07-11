import useSWR from "swr"
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store"

export const useGalleryHook = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore,
        { fallbackData: initialGlobalSettingStore })
    return {
        galleryList: globalStoreData.galleryList,
        openGallery: () => {
            document.getElementById('openGalleryInput')!.click();
        },
        setGalleryImages: (images: any[]) => {
            mutateGlobalStoreData({
                ...globalStoreData,
                galleryList: images.map(f => [
                    {
                        original: f,
                        thumbnail: f,
                    }
                ])[0]
            }, false)
        }
    }

}