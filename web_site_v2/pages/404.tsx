import { useRouter } from "next/router";

const Custom404 = () => {
    const router=useRouter();
    return (
        <div className="bg-gradient-to-r from-purple-300 to-blue-200">
            <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
                    <div className="border-t border-gray-200 text-center pt-8">
                        <h1 className="text-9xl font-bold text-purple-400">404</h1>
                        <h1 className="text-6xl font-medium py-8">oops! 找不到此頁面</h1>
                        <p className="text-2xl pb-8 px-12 font-medium">Oops! 此頁面可能被刪除或是被移到其他位置</p>
                        <button 
                        onClick={()=>router.back()}
                        className="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 
                        hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6">
                            回上一頁
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Custom404
