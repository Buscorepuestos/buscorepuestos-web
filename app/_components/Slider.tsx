'use client'
import React, { createContext } from 'react'
import { Swiper } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

export default function slidesPerView(props: { children: React.ReactNode }) {
	return (
		<>
			<Swiper
				slidesPerView={3}
				spaceBetween={10}
				pagination={{
					clickable: true,
				}}
				modules={[Pagination]}
				className="w-[1200] h-[400]"
			>
				{props.children}
			</Swiper>
		</>
	)
}
