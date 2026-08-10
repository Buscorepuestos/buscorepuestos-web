'use client'

import React, { useEffect, useState } from 'react'
import {
	VACATION_NOTICE_DISMISSED_EVENT,
	VACATION_NOTICE_SESSION_KEY,
	vacationNoticeParagraphs,
	vacationNoticeTitle,
} from './vacationNoticeContent'

export default function VacationNoticeModalWrapper() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const hasSeenNotice = sessionStorage.getItem(VACATION_NOTICE_SESSION_KEY)
		if (!hasSeenNotice) {
			setIsVisible(true)
			return
		}

		window.dispatchEvent(new Event(VACATION_NOTICE_DISMISSED_EVENT))
	}, [])

	const handleClose = () => {
		sessionStorage.setItem(VACATION_NOTICE_SESSION_KEY, 'true')
		setIsVisible(false)
		window.dispatchEvent(new Event(VACATION_NOTICE_DISMISSED_EVENT))
	}

	if (!isVisible) return null

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 font-tertiary-font">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="vacation-notice-title"
				className="w-full max-w-[560px] rounded-[24px] border-2 border-secondary-blue bg-white px-6 py-7 text-center shadow-2xl mobile:px-5 mobile:py-6"
			>
				<p className="text-[42px] leading-none mobile:text-[34px]" aria-hidden="true">
					🌴
				</p>
				<h2
					id="vacation-notice-title"
					className="mt-3 text-[26px] font-bold leading-tight text-secondary-blue mobile:text-[21px]"
				>
					{vacationNoticeTitle}
				</h2>
				<div className="mt-5 space-y-4 text-[17px] leading-relaxed text-custom-grey mobile:text-[15px]">
					<p>{vacationNoticeParagraphs[0]}</p>
					<p>
						{vacationNoticeParagraphs[1]} <span aria-hidden="true">🔋😊</span>
					</p>
					<p className="font-semibold text-dark-grey">{vacationNoticeParagraphs[2]}</p>
				</div>
				<button
					type="button"
					onClick={handleClose}
					className="mt-7 rounded-3xl border-2 border-secondary-blue bg-secondary-blue px-10 py-2.5 text-[17px] font-bold text-white transition-colors hover:bg-white hover:text-secondary-blue mobile:w-full"
				>
					Entendido
				</button>
			</div>
		</div>
	)
}
