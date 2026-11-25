'use client';

import React, { useState, useEffect } from 'react';
import CookieConsentModal from './CookieConsentModal';

export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const CONSENT_CHANGED_EVENT = 'cookie-consent-changed';

export default function CookieConsentModalWrapper() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Mostrar el modal si no se han aceptado o rechazado las cookies
		const hasConsented = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (!hasConsented) {
			setIsVisible(true);
		}
	}, []);

	const handleAcceptCookies = () => {
		localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
		window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
		setIsVisible(false);
	};

	const handleRejectCookies = () => {
		localStorage.setItem(CONSENT_STORAGE_KEY, 'rejected');
		window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<CookieConsentModal onAccept={handleAcceptCookies} onReject={handleRejectCookies} />
	);
}
