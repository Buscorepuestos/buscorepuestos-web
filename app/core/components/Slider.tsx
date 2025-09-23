'use client'
import React, { createContext } from 'react'
import { Swiper } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import { Grid, Pagination} from 'swiper/modules'

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
	isMobile?: boolean
	children: React.ReactNode
}

const grid = {
	rows: 1,
	fill: 'row' as const,
};

export default function slider(props: SliderProps) {
	const {
		isMobile,
		slidePerView = 5,
		spaceBetween = 100,
		height = isMobile ? 450 : 470,
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
				modules={[Grid, Pagination]}
				style={{ height: height, maxWidth }}
				breakpoints={breakpoints}
				grid={isMobile ? grid : {}}
				role='region'
			>
				{props.children}
			</Swiper>
		</>
	)
}
