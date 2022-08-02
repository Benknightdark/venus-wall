import { useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "../utils/modalMessageHook";

const CrawlerModal = (props: any) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    // const [modalData, setModalData] = useState({ modalTitle: props.modalTitle, selectedId: props.selectedId })
    const modal = useModal();
    const onSubmit = async (data: any) => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/item/${props.selectedId?.toString().toUpperCase()}?start=${data.start}&end=${data.end}`
            , {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                }
            }
        )
        document.getElementById('crawler-modal-btn')!.click();
        if (req.status === 200) {
            const res = await req.json();
            modal.showSuccess(`成功執行【${props.modalTitle}】爬蟲，並從第${data.start}頁抓到第${data.end}頁`)
        } else {
            modal.showSuccess(await req.text())
        }
    };
    return (
        <div>
            <label htmlFor="crawler-modal" className="btn modal-button hidden" id='crawler-modal-btn'>open modal</label>
            <input type="checkbox" id="crawler-modal" className="modal-toggle" />
            <label htmlFor="crawler-modal" className="modal cursor-pointer">
                <form className="modal-box relative" onSubmit={handleSubmit(onSubmit)}>
                    <div className='font-lg'>執行【{props?.modalTitle}】爬蟲</div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">開始頁數</span>
                        </label>
                        <input type="number" defaultValue={0} placeholder="開始頁數" className="input input-bordered w-full max-w-xs"
                            {...register("start", { min: 0, required: true })}
                        />
                        {errors.start && <div className="text-red-500">開始頁數不能是空值</div>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">結束頁數</span>
                        </label>
                        <input type="number" defaultValue={0} placeholder="結束頁數" className="input input-bordered w-full max-w-xs"
                            {...register("end", { min: 0, required: true })}
                        />
                        {errors.end && <div className="text-red-500">結束頁數不能是空值</div>}
                    </div>
                    <div className='pt-2'></div>
                    <button type="submit" className="btn btn-primary">執行</button>
                </form>
            </label>
        </div>
    );
}

export default CrawlerModal;