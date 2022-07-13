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
            const imagesMapList = images.map(
                (image) => {
                    return {
                        original: image,
                        thumbnail: image
                    };
                }
            );
            mutateGlobalStoreData({
                ...globalStoreData,
                galleryList: imagesMapList
            }, false)
            console.log(globalStoreData.galleryList)
        }
    }

}
