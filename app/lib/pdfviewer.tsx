import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Establece la ruta de la biblioteca de worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

interface PDFViewerProps {
	pdfUrl: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const renderTaskRef = useRef<any>(null) // Puedes definir un tipo más específico aquí

	useEffect(() => {
		const renderPDF = async () => {
			if (canvasRef.current) {
				setLoading(true)
				setError(null) // Reinicia el estado de error
				const loadingTask = pdfjsLib.getDocument(pdfUrl)

				try {
					const pdf = await loadingTask.promise
					const page = await pdf.getPage(1)
					const viewport = page.getViewport({ scale: 1 })

					const canvas = canvasRef.current
					const context = canvas.getContext('2d')
					if (context) {
						// Establecer el tamaño del lienzo
						const scale = Math.min(
							window.innerWidth / viewport.width,
							1
						) // Escalado según el ancho de la ventana
						canvas.height = viewport.height * scale
						canvas.width = viewport.width * scale

						const renderContext = {
							canvasContext: context,
							viewport: viewport,
						}

						if (renderTaskRef.current) {
							renderTaskRef.current.cancel()
						}

						renderTaskRef.current = page.render(renderContext)
						await renderTaskRef.current.promise
					}
				} catch (error) {
					if (
						(error as Error).name !== 'RenderingCancelledException'
					) {
						console.error('Error rendering PDF:', error)
						setError('Error al cargar el PDF.')
					}
				} finally {
					setLoading(false)
				}
			}
		}

		renderPDF()

		return () => {
			if (renderTaskRef.current) {
				renderTaskRef.current.cancel()
			}
		}
	}, [pdfUrl])

	return (
		<div
			style={{
				position: 'relative',
				maxWidth: '100%',
				overflow: 'auto',
				margin: '0 auto',
			}}
		>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<canvas
				ref={canvasRef}
				style={{
					border: '1px solid black',
					width: '100%',
					height: 'auto',
				}}
			/>
		</div>
	)
}

export default PDFViewer
