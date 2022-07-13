import { AiFillCloseCircle } from "react-icons/ai";
import { useEffect } from 'react';
import { useToast } from "../utils/toastMessageHook";
import { MessageType } from "../models/MessageType";

const ToastMessage = () => {
    const toast = useToast();
    useEffect(() => {
        if (toast.showToast) {
            setTimeout(() => {
                toast.hide();
            }, 2000)
        }
    }, [toast])
    return (
        <div className="w-screen h-screen absolute bg-transparent">
            <div className="absolute top-5 right-5 left-0 sm:left-auto w-full grid justify-center px-4 sm:absolute">
                <div className="space-y-2 left-0 sm:left-auto w-full grid justify-center sm:justify-end px-4 absolute sm:right-0">
                    <div className="min-h-[16] w-80 px-4 py-2 bg-white rounded-md shadow-lg border border-gray-200 sm:right-0
                    z-50
                    ">
                        <div className={`flex space-x-2 ${toast.toastMessageType === MessageType.Success ? "text-green-500" : "text-red-500"} 
                        justify-between`}>
                            <div className="font-bold">{toast.toastMessage}</div>
                            <AiFillCloseCircle className="w-6 h-6 cursor-pointer"
                                onClick={() => {
                                    toast.hide();
                                }}
                            ></AiFillCloseCircle>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToastMessage;