'use client'
import React, { createContext } from 'react'
import { Swiper } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

type Breakpoints = {
	[key: number]: {
		slidesPerView?: number
		spaceBetween?: number
	}
}

interface SliderProps {
	slidePerView?: number
	spaceBetween?: number
	height?: number
	maxWidth?: string
	breakpoints?: Breakpoints
	children: React.ReactNode
}

export default function slider(props: SliderProps) {
	const {
		slidePerView = 5,
		spaceBetween = 100,
		height = 420,
		maxWidth = '95vw',
		breakpoints,
	} = props

	return (
		<>
			<Swiper
				slidesPerView={slidePerView}
				spaceBetween={spaceBetween}
				pagination={{
					clickable: true
				}}
				modules={[Pagination]}
				style={{ height: height, maxWidth }}
				breakpoints={breakpoints}
			>
				{props.children}
			</Swiper>
		</>
	)
}
