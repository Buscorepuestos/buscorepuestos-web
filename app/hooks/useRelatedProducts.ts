import { useEffect, useState } from 'react'
import { RelatedProduct, getRelatedProducts } from '../services/products/products.service'

export const useRelatedProducts = (productId: string) => {
    const [related, setRelated] = useState<RelatedProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!productId) return
        setLoading(true)
        getRelatedProducts(productId)
            .then(setRelated)
            .finally(() => setLoading(false))
    }, [productId])

    return { related, loading }
}