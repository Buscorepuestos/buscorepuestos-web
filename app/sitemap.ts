import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.buscorepuestos.com'

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		'', '/tienda', '/sobre-nosotros', '/ayuda', '/contacto', '/aviso-legal',
		'/politica-cookies', '/politica-privacidad', '/terminos-condiciones',
	]
	return routes.map((route) => ({
		url: `${BASE_URL}${route}`,
		changeFrequency: route === '' ? 'daily' : 'monthly',
		priority: route === '' ? 1 : route === '/tienda' ? 0.8 : 0.4,
	}))
}
