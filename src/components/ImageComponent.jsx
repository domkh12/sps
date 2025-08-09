import {useEffect, useState} from "react";
import useImageCache from "../hook/useImageCache.jsx";

function ImageComponent({ imageUrl, alt, clasname }){
    const [src, setSrc] = useState('')
    const [loading, setLoading] = useState(true)
    const { loadImage } = useImageCache()

    useEffect(() => {
        loadImage(imageUrl)
            .then(setSrc)
            .finally(() => setLoading(false))
    }, [imageUrl, loadImage])

    if (loading) return <div className="bg-gray-200 animate-pulse h-48" />

    return <img src={src} alt={alt} loading="lazy" className={clasname ? clasname : "w-full h-full object-cover"}/>
}

export default ImageComponent;