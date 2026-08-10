import React from 'react'
import { vacationPurchasePauseText } from './vacationNoticeContent'

export default function VacationPurchasePause() {
	return (
		<div className="w-full rounded-2xl border border-secondary-blue bg-[#F2FDFF] px-5 py-4 text-center font-tertiary-font text-secondary-blue mobile:px-4 mobile:py-3">
			<p className="text-[16px] font-bold leading-tight mobile:text-[3.5vw]">
				Compras temporalmente pausadas
			</p>
			<p className="mt-1 text-[14px] leading-snug text-custom-grey mobile:text-[3vw]">
				{vacationPurchasePauseText}
			</p>
		</div>
	)
}
