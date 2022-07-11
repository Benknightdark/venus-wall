import ImageGallery from 'react-image-gallery';
import { useGalleryHook } from '../utils/galleryHook';

const Gallery = () => {
    const { galleryList } = useGalleryHook();
    return (
        <>
            <label htmlFor="show-gallery" className="btn modal-button hidden " id='openGalleryInput'>open modal</label>
            <input type="checkbox" id="show-gallery" className="modal-toggle" />
            <label htmlFor="show-gallery" className="modal cursor-pointer">
                <ImageGallery items={galleryList} showThumbnails={false}/>
            </label>
        </>
    );
}

export default Gallery;