'use client';

import React, { useState, useEffect } from 'react';
import CookieConsentModal from './CookieConsentModal';
import {
	VACATION_NOTICE_DISMISSED_EVENT,
	VACATION_NOTICE_SESSION_KEY,
} from '../vacationNotice/vacationNoticeContent';

export default function CookieConsentModalWrapper() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const showCookieModal = () => {
			const hasConsented = localStorage.getItem('cookie-consent');
			if (!hasConsented) {
				setIsVisible(true);
			}
		};

		if (sessionStorage.getItem(VACATION_NOTICE_SESSION_KEY)) {
			showCookieModal();
			return;
		}

		window.addEventListener(VACATION_NOTICE_DISMISSED_EVENT, showCookieModal);

		return () => {
			window.removeEventListener(VACATION_NOTICE_DISMISSED_EVENT, showCookieModal);
		};
	}, []);

	const handleAcceptCookies = () => {
		localStorage.setItem('cookie-consent', 'accepted');
		setIsVisible(false);
	};

	const handleRejectCookies = () => {
		localStorage.setItem('cookie-consent', 'rejected');
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<CookieConsentModal onAccept={handleAcceptCookies} onReject={handleRejectCookies} />
	);
}
