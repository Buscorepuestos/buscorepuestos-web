'use client'
import React, { createContext } from 'react'
import { Swiper } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

export default function slider(props: {
	slidePerView?: number
	spaceBetween?: number
	height?: number
	maxWidth?: number
	children: React.ReactNode
}) {
	const {
		slidePerView = 5,
		spaceBetween = 100,
		height = 420,
		maxWidth = 1400,
	} = props

	return (
		<>
			<Swiper
				slidesPerView={slidePerView}
				spaceBetween={spaceBetween}
				pagination={{
					clickable: true,
				}}
				modules={[Pagination]}
				style={{ height: height, maxWidth }}
			>
				{props.children}
			</Swiper>
		</>
	)
}