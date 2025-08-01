import { useState, useEffect } from 'react'

function useImageCache() {
    const cache = new Map()

    const loadImage = async (url) => {
        if (cache.has(url)) {
            return cache.get(url)
        }

        const img = new Image()
        img.src = url

        const promise = new Promise((resolve, reject) => {
            img.onload = () => resolve(url)
            img.onerror = reject
        })

        cache.set(url, promise)
        return promise
    }

    return { loadImage }
}

export default useImageCache;