import React, { useState, ChangeEvent } from 'react'
import { updateTransferPurchase } from '../../../services/purchase/purchase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../../lib/firebase'
import { FormsFields } from '../../../core/components/checkoutPage/CheckoutPage'
import { createBill } from '../../../services/billing/billing.service'
import { userService } from '../../../services/user/userService'
import { useRouter } from 'next/navigation'
import { updateUser } from '../../../services/mailchimp/mailchimp'
import Image from 'next/image'
import PDFViewer from '@/app/lib/pdfviewer'
import * as XLSX from 'xlsx'

interface TransferData {
	banco: string
	beneficiario: string
	iban: string
	bic: string
}

interface TransferPaymentProps {
	totalPrice: string
	purchaseIds: string[]
	fieldsValue: FormsFields
}

const TransferPayment: React.FC<TransferPaymentProps> = ({
	totalPrice,
	purchaseIds,
	fieldsValue,
}) => {
	const transferDataCaixa: TransferData = {
		banco: 'La Caixa',
		beneficiario: 'Buscorepuestos.com',
		iban: 'ES12 2100 2005 2602 0010 7904',
		bic: 'CAIXESBBXXX',
	}
	const router = useRouter()
	const [copiedField, setCopiedField] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [previewType, setPreviewType] = useState<
		'image' | 'pdf' | 'excel' | null
	>(null)
	const [isProcessing, setIsProcessing] = useState(false)

	let userId: string | null = null
	if (typeof window !== 'undefined') {
		userId = localStorage.getItem('airtableUserId')
	}

	const copyToClipboard = (
		text: string,
		option: number,
		key: string
	): void => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopiedField(`${option}-${key}`)
				setTimeout(() => setCopiedField(null), 2000)
			})
			.catch(() => {
				alert('No se pudo copiar el texto')
			})
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		setPreviewUrl(null)
		setPreviewType(null)
		if (file) {
			setSelectedFile(file)

			const fileType = file.type.split('/')[0]
			const fileURL = URL.createObjectURL(file)

			if (fileType === 'image') {
				setPreviewUrl(fileURL)
				setPreviewType('image')
			} else if (fileType === 'application') {
				if (file.type === 'application/pdf') {
					setPreviewUrl(fileURL)
					setPreviewType('pdf')
				} else if (
					file.type ===
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				) {
					const reader = new FileReader()
					reader.onload = (e) => {
						const data = new Uint8Array(
							e.target?.result as ArrayBuffer
						)
						const workbook = XLSX.read(data, { type: 'array' })
						const firstSheet =
							workbook.Sheets[workbook.SheetNames[0]]
						const jsonData = XLSX.utils.sheet_to_json(firstSheet)
						console.log(jsonData) // Se puede usar esta informacion para mostrarla en la vista
					}
					reader.readAsArrayBuffer(file)
					setPreviewType('excel')
				}
			}
		}
	}

	const renderTransferOption = (data: TransferData, option: number) => (
		<div className="my-4 p-4 border rounded shadow-sm">
			<p className="font-bold mb-2">Opción {option}</p>
			<div className="space-y-2">
				{Object.entries(data).map(([key, value]) => {
					const displayKey = key === 'iban' ? 'IBAN' : key.charAt(0).toUpperCase() + key.slice(1);
					return (
						<div key={key} className="flex gap-4 items-center">
							<span>{`${displayKey}: ${value}`}</span>
							<button
								onClick={() => copyToClipboard(value, option, key)}
							>
								<Image
									src={
										copiedField === `${option}-${key}`
											? '/tick-azul-buscorepuestos.svg'
											: '/copiar-icono-buscorepuestos.svg'
									}
									alt="copy"
									width={20}
									height={20}
								/>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	)

	const uploadFile = async (file: Blob, path: string) => {
		const storageRef = ref(storage, path)
		await uploadBytes(storageRef, file)
		const url = await getDownloadURL(storageRef)
		return url
	}

	const handlePayment = async () => {
		if (!selectedFile) {
			alert('Debes adjuntar un archivo')
			return
		}

		setIsProcessing(true)
		await updateUser({
			firstName: fieldsValue.name,
			email: fieldsValue.email,
		})
		await createbilling()
		await createBill({
			Compras: purchaseIds,
			Usuarios: [userId!],
			transfer: true,
			address: fieldsValue.shippingAddress,
			country: fieldsValue.country,
			location: fieldsValue.city,
			addressNumber: fieldsValue.addressExtra,
			name: fieldsValue.name,
			cp: fieldsValue.zip,
			nif: fieldsValue.nif,
			phone: Number(fieldsValue.phoneNumber),
			province: fieldsValue.province,
		})
		await userService.createUserAddresses({
			user: [userId!],
			name: fieldsValue.name,
			nif: fieldsValue.nif,
			address: fieldsValue.shippingAddress,
			country: fieldsValue.country,
			location: fieldsValue.city,
			addressNumber: fieldsValue.addressExtra,
			phone: Number(fieldsValue.phoneNumber),
			province: fieldsValue.province,
			cp: fieldsValue.zip,
			['Correo electrónico']: fieldsValue.email,
		})
		const fileType = selectedFile.type.split('/')[1]
		const imgTransfer = await uploadFile(
			selectedFile,
			`billing-image_by_purchase/${userId}/${new Date().getTime()}.${fileType}`
		)
		purchaseIds.forEach(async (purchaseId) => {
			await updateTransferPurchase(purchaseId, imgTransfer)
		})
		router.push('/pago-exitoso?pagoSumup=true')
	}

	const createbilling = async () => {
		const billingData = {
			Compras: purchaseIds,
			Usuarios: [userId!],
			transfer: false,
			address: fieldsValue.shippingAddress,
			country: fieldsValue.country,
			location: fieldsValue.city,
			addressNumber: fieldsValue.addressExtra,
			name: fieldsValue.name,
			cp: fieldsValue.zip,
			nif: fieldsValue.nif,
			phone: Number(fieldsValue.phoneNumber),
			province: fieldsValue.province,
		}

		const extraData = {
			email: fieldsValue.email,
			billingAddress: fieldsValue.billingAddress,
			billingAddressExtra: fieldsValue.billingAddressExtra,
			billingProvince: fieldsValue.billingProvince,
			billingZip: fieldsValue.billingZip,
		}

		try {
			const storedBillingData = localStorage.getItem('billingData')
			const storedEmailData = localStorage.getItem('extraData')
			const cart = localStorage.getItem('cart')
			const executedBill = localStorage.getItem('billingExecuted')
			if (cart) {
				const copyCartExist = localStorage.getItem('copyCart')
				if (copyCartExist) {
					localStorage.removeItem('copyCart')
				}
				const copyCart = JSON.parse(cart)
				localStorage.setItem('copyCart', JSON.stringify(copyCart))
			}
			if (executedBill) {
				localStorage.removeItem('billingExecuted')
			}
			if (storedBillingData) {
				localStorage.removeItem('billingData')
			}
			if (storedEmailData) {
				localStorage.removeItem('extraData')
			}
			localStorage.setItem('billingData', JSON.stringify(billingData))
			localStorage.setItem('extraData', JSON.stringify(extraData))
		} catch (error) {
			console.error('Error saving billing data to localStorage:', error)
		}
	}

	return (
		<div className="font-tertiary-font text-custom-grey px-4 sm:px-6 lg:px-8">
			<div className="text-center">
				<p className="text-sm sm:text-base">
					Para finalizar tu compra con este método de pago,
					<br />
					necesitaremos que como concepto pongas tu nombre completo y
					nos adjuntes el <br />
					comprobante de la transferencia, para agilizar el envío.
				</p>
				<p className="mt-4 text-sm sm:text-base">
					Para adjuntar el comprobante usa el campo de &apos;adjuntar
					archivo&apos;
					<br />o envíanos un email, admin@buscorepuestos.com
				</p>
			</div>
			<div className="my-6 flex flex-col gap-4">
				{renderTransferOption(transferDataCaixa, 1)}
			</div>
			<div className="text-center mt-4">
				<p>
					El total de tu compra es de{' '}
					<span className="font-bold">{totalPrice} €</span>
				</p>
			</div>
			<div className="my-4">
				<label
					htmlFor="fileUpload"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					Adjuntar archivo
				</label>
				<input
					type="file"
					id="fileUpload"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
				/>
				{previewUrl && previewType === 'image' && (
					<Image
						src={previewUrl}
						alt="Vista previa"
						className="mt-4 rounded-lg"
						width={100}
						height={100}
					/>
				)}
				{previewUrl && previewType === 'pdf' && (
					<PDFViewer pdfUrl={previewUrl} />
				)}
			</div>

			{isProcessing ? (
				<div className="flex justify-end my-4">
					<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="flex justify-end">
					<button
						onClick={handlePayment}
						className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Finalizar compra
					</button>
				</div>
			)}
		</div>
	)
}

export default TransferPayment
