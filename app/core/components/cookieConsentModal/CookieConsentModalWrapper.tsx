'use client';

import React, { useState, useEffect } from 'react';
import CookieConsentModal from './CookieConsentModal';

export default function CookieConsentModalWrapper() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Mostrar el modal si no se han aceptado o rechazado las cookies
		const hasConsented = localStorage.getItem('cookie-consent');
		if (!hasConsented) {
			setIsVisible(true);
		}
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
