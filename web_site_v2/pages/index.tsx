import { ReactElement, useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import Loading from '../components/loading'
import Image from 'next/image'
import { useRouter } from 'next/router'
import IndexLayout from './utils/index-layout'
import { useGalleryHook } from '../utils/galleryHook'
import Gallery from '../components/gallery'
import { useToast } from '../utils/toastMessageHook'
import { imageFetch } from '../utils/imageFetchHelper'
import useSWR from 'swr'
import { globalSettingStore, initialGlobalSettingStore } from '../stores/global-setting-store'
const fetcher = (url: string) => fetch(url).then(res => res.json())

const Home = () => {
  const { data: globalStoreData, mutate: globalStoreDataMutate } = useSWR(globalSettingStore,
    { fallbackData: initialGlobalSettingStore })
  const [showLoading, setShowLoading] = useState(false)
  const { data, size, setSize, error } = useSWRInfinite(index =>
    `${process.env.NEXT_PUBLIC_APIURL}/api/item?offset=${index}&limit=${20}${globalStoreData.selectedBoard == null ? '' : "&id=" + globalStoreData.selectedBoard.value}`,
    fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const { openGallery, setGalleryImages } = useGalleryHook();
  const toast = useToast();
  useEffect(() => {
    document.getElementById('contentBody')!.onscroll = async () => {
      if (showLoading) return
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        console.log("開始撈下一頁")
        await setShowLoading(true)
        await setSize(size + 1)
        await setShowLoading(false)
        console.log("完成撈下一頁")
        console.log('----------------------------')
      }
    };
  });
  if (error) return <Loading></Loading>
  if (!data) return <Loading></Loading>
  return (
    <div className="flex flex-col">
      <div className="fixed  top-20 animated z-50 w-full">
      </div>
      <div className='grid  grid-rows-1 pt-5 pl-3 pr-3' >
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4">
          {data && data.map((item: any) => (
            item.map((itemData: any) => {
              return (
                // <div className="rounded-lg shadow-xl bg-white py-3 px-6  border-2 border-purple-500 
                // cursor-pointer
                //     hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-red-500 hover:ring-indigo-300" key={itemData.image}>
                //   {
                //     itemData.Avator && globalStoreData.showImage && <Image
                //       layout='responsive'
                //       width='100%'
                //       height='100%'
                //       src={itemData.Avator}
                //       alt={itemData.Title}
                //       className="rounded-t-lg h-120 w-full object-cover z-0 "
                //       onError={() => <Image
                //         layout='responsive'
                //         width='100%'
                //         height='100%'
                //         src='/images/error.gif'
                //         alt={itemData.Title}
                //         className="rounded-t-lg h-120 w-full object-cover z-0 "
                //       />}
                //       onClick={() => {
                //         setGalleryImages([itemData.Avator])
                //         openGallery();
                //       }}

                //     />
                //   }
                //   <header className=" text-xl font-extrabold p-4">{itemData.Title}</header>

                //   <footer className="text-center py-3 px-5 text-gray-500">
                //     <div className="flex flex-row space-x-4">
                //       <button
                //         className="  py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
                //         onClick={async () => {
                //           const fetchData = await imageFetch(itemData.ID);
                //           console.log(fetchData)
                //           if (fetchData.length > 0) {
                //             setGalleryImages(fetchData.map((a: any) => a.Url))
                //             openGallery();
                //           } else {
                //             toast.showError('沒有任何圖片')
                //           }
                //         }}
                //       >
                //         看更多
                //       </button>
                //     </div>


                //   </footer>
                // </div>
                <div key={itemData.image} className="relative group overflow-hidden
                 bg-black  border-2 border-purple-500
                 cursor-pointer
                hover:shadow-md  transform hover:-translate-y-1 transition-all
                 duration-200 hover:border-red-500 hover:ring-indigo-300
                 
                 ">
                  {
                    itemData.Avator && globalStoreData.showImage ? <Image
                      layout='responsive'
                      width='100%'
                      height='100%'
                      src={itemData.Avator}
                      alt={itemData.Title}
                      className="dashboard-image"
                      onError={() => <Image
                        layout='responsive'
                        width='100%'
                        height='100%'
                        src='/images/error.gif'
                        alt={itemData.Title}
                        className="dashboard-image"
                      />}
                      onClick={() => {
                        setGalleryImages([itemData.Avator])
                        openGallery();
                      }}
                    />:<Image
                    layout='responsive'
                    width='100%'
                    height='100%'
                    src='/images/error.gif'
                    alt={itemData.Title}
                    className="dashboard-image"
                  />
                  }
                  <div className="absolute w-full h-full shadow-2xl opacity-20 transform duration-500 inset-y-full
                   group-hover:-inset-y-0">
                  </div>
                  <div className="absolute bg-gradient-to-t from-black w-full h-full transform duration-500                  
                  inset-y-3/4 group-hover:-inset-y-0"  >
                    <div className="absolute w-full flex place-content-center">
                      <p className="capitalize font-serif font-bold text-xl text-center shadow-2xl text-white mt-10">
                        {itemData.ItemWebPageID_U.Name} - {itemData.ItemWebPageID_U.Seq}</p>
                    </div>
                    <div className="absolute w-full flex place-content-center mt-20" >
                      <p className="font-sans text-center w-4/5 text-white mt-5">
                        {itemData.Title}</p>
                    </div>
                    <button className="absolute left-1/4 bottom-4
                     bg-white text-black font-bold rounded-lg h-10 w-48"
                      onClick={async () => {
                        const fetchData = await imageFetch(itemData.ID);
                        console.log(fetchData)
                        if (fetchData.length > 0) {
                          setGalleryImages(fetchData.map((a: any) => a.Url))
                          openGallery();
                        } else {
                          toast.showError('沒有任何圖片')
                        }
                      }}
                    >看更多</button>
                  </div>
                </div>
              )
            })
          ))}
        </div>
        {showLoading && <Loading></Loading>}
      </div>
    </div>
  )
}
Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <IndexLayout>
      {page}
      <Gallery></Gallery>
    </IndexLayout>
  )
}
export default Home
