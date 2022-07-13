const ModalMessage = () => {
    return (
        <div>
            <label htmlFor="message-modal" className="btn modal-button hidden" id="message-modal-btn">open modal</label>
            <input type="checkbox" id="message-modal" className="modal-toggle" />
            <label htmlFor="message-modal" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
                </label>
            </label>
        </div>
    );
}

export default ModalMessage;