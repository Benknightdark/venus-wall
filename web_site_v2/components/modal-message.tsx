import { useModal } from "../utils/modalMessageHook";
import { useEffect } from 'react';
import { ImCross, ImCheckmark } from "react-icons/im";
import { MessageType } from '../models/MessageType';

const ModalMessage = () => {
    const modalMessage = useModal();
    useEffect(() => {
        if (modalMessage.showModal) {
            document.getElementById('message-modal-btn')?.click();
        }
    },[modalMessage])
    return (
        <div>
            <label htmlFor="message-modal" className="btn modal-button hidden" id="message-modal-btn">open modal</label>
            <input type="checkbox" id="message-modal" className="modal-toggle" />

            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="message-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={()=>{
                        modalMessage.hide();
                    }}>✕</label>
                    <h3 className="text-lg font-bold pb-3">{modalMessage.modalMessage}</h3>
                                    <div className='flex flex-row justify-center'>
                                        {
                                            modalMessage.modalMessageType === MessageType.Success ?
                                                <ImCheckmark className="w-12 h-12 text-green-300"></ImCheckmark> :
                                                <ImCross className="w-12 h-12 text-red-300"></ImCross>
                                        }
                                    </div>
                </div>
                </div>           
        </div>
    );
}

export default ModalMessage;