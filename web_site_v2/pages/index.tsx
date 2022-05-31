import { ReactElement, useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import Loading from '../components/loading'
import Image from 'next/image'
import { useRouter } from 'next/router'
import IndexLayout from './utils/index-layout'
const fetcher = (url: string) => fetch(url).then(res => res.json())

const Home = () => {
  // const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/item?offset=${0}&limit=${30}`, fetcher)
  const [showLoading, setShowLoading] = useState(false)
  const { data, size, setSize, error } = useSWRInfinite(index =>
    `${process.env.NEXT_PUBLIC_APIURL}/api/item?offset=${index}&limit=${30}`,
    fetcher)
  const router = useRouter();
  useEffect(() => {
    document.getElementById('contentBody')!.onscroll = async () => {
      // console.log((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight)
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
        <button
          className="  py-2 px-4 mt-5 bg-red-300 rounded-lg text-white font-semibold hover:bg-red-600"
          onClick={() => {
            router.push({
              pathname: '/',
            })
          }}
        >
          回上一頁
        </button>
      </div>
      <div className='grid  grid-rows-1 pt-20' >
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4">
          {data && data.map((item: any) => (
            item.map((itemData: any) => {
              return (
                <div className="rounded-lg shadow-xl bg-white py-3 px-6  border-2 border-purple-500 
                    hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-red-500 hover:ring-indigo-300" key={itemData.image}>
                 {
                    itemData.Avator&&<Image
                    layout='responsive'
                    width='100%'
                    height='100%'
                    src={itemData.Avator}
                    alt={itemData.Title}
                    className="rounded-t-lg h-120 w-full object-cover z-0 "
                    onError={() => <Image
                      layout='responsive'
                      width='100%'
                      height='100%'
                      src='/images/error.gif'
                      alt={itemData.Title}
                      className="rounded-t-lg h-120 w-full object-cover z-0 "
                    />}

                  />
                 }
                  <header className=" text-xl font-extrabold p-4">{itemData.Title}</header>

                  <footer className="text-center py-3 px-5 text-gray-500">
                    <div className="flex flex-row space-x-4">
                      <button
                        className="  py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
                        onClick={() => {
                          // router.push({
                          //   pathname: '/chapter',
                          //   query: { url: itemData.link, subTitle: itemData.title, backUrl: '/commic?url=' + router.query['url'] + '&subTitle=' + router.query['subTitle']?.toString()! }
                          // })
                        }}
                      >
                        看更多
                      </button>
                      <button
                        className="  py-2 px-4 mt-5 bg-yellow-400 rounded-lg text-white font-semibold hover:bg-yellow-600"
                        onClick={async () => {
                          const req = await fetch("/api/favorite/add", {
                            method: "POST",
                            body: JSON.stringify(itemData),
                            headers: { "content-type": "application/json" },
                          });
                          if (req.status === 200) {
                            alert(`已新增『${itemData.title}』至我的最愛`)

                          } else {
                            const message = (await req.json());
                            alert(message['message'])
                          }
                        }}
                      >
                        加入最愛
                      </button>
                    </div>


                  </footer>
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
    </IndexLayout>
  )
}
export default Home
