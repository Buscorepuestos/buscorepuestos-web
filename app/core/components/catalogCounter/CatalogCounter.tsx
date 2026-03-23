'use client'
import React, { useEffect, useRef, useState } from 'react'
import { getCatalogCount } from '../../../services/products/products.service'

const REFRESH_INTERVAL_MS = 30_000  // refresca cada 30 segundos
const ANIMATION_DURATION_MS = 1_800 // duración del contador animado

function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function formatNumber(n: number): string {
    return n.toLocaleString('es-ES') // → "15.435.468"
}

export default function CatalogCounter() {
    const [displayCount, setDisplayCount] = useState<number | null>(null)
    const [targetCount, setTargetCount] = useState<number>(0)
    const animFrameRef = useRef<number | null>(null)
    const startRef = useRef<number | null>(null)
    const fromRef = useRef<number>(0)

    const animateTo = (from: number, to: number) => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        fromRef.current = from
        startRef.current = null

        const step = (timestamp: number) => {
            if (!startRef.current) startRef.current = timestamp
            const elapsed = timestamp - startRef.current
            const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1)
            const eased = easeOutExpo(progress)
            const current = Math.round(from + (to - from) * eased)
            setDisplayCount(current)
            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(step)
            }
        }
        animFrameRef.current = requestAnimationFrame(step)
    }



    useEffect(() => {
        const fetchCount = async () => {
            const newCount = await getCatalogCount()
            if (newCount > 0) {
                setTargetCount(prev => {
                    // Anima desde el valor anterior (o 0 en el primer fetch)
                    animateTo(prev || newCount * 0.97, newCount)
                    return newCount
                })
            }
        }
        fetchCount()
        const interval = setInterval(fetchCount, REFRESH_INTERVAL_MS)
        return () => {
            clearInterval(interval)
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        }
    }, [])
    console.log('Catalog count:', displayCount)
    if (displayCount === null) {
        // Skeleton mientras carga la primera vez
        return (
            <span className="inline-block w-40 h-10 bg-primary-blue/20 animate-pulse rounded-md" />
        )
    }

    return (
        <span className="text-primary-blue font-extrabold tabular-nums mx-2">
            {formatNumber(displayCount)}
        </span>
    )
}
