'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { login } from '../../lib/auth'
import {
	AdminProductPrice,
	getAdminProduct,
	updateAdminProductPrice,
	verifyAdminSession,
} from '../../services/admin/productPrice.service'

type Notice = { type: 'error' | 'success'; message: string } | null

class AdminAccessError extends Error {
	constructor(public readonly code: 'ADMIN_CLAIM_MISSING') {
		super(code)
	}
}

const getAdminToken = async (user: User, forceRefresh = false) => {
	const tokenResult = await user.getIdTokenResult(forceRefresh)
	if (tokenResult.claims.admin !== true) {
		throw new AdminAccessError('ADMIN_CLAIM_MISSING')
	}
	return tokenResult.token
}

const errorMessage = (error: unknown) => {
	if (
		error instanceof AdminAccessError &&
		error.code === 'ADMIN_CLAIM_MISSING'
	) {
		return 'Firebase aceptó tu usuario, pero su token no contiene el permiso admin: true. Pide al backend que asigne el custom claim al UID correcto y vuelve a iniciar sesión.'
	}
	const status = (error as { response?: { status?: number } })?.response
		?.status
	if (status === 401)
		return 'Firebase inició sesión y el token contiene admin: true, pero el backend rechazó ese token. Comprueba que Firebase Admin use el mismo proyecto que este frontend.'
	if (status === 403) return 'Esta cuenta no tiene permisos de administrador.'
	if (status === 404) return 'No encontramos un producto con ese ID.'
	if (status === 409)
		return 'El producto cambió mientras lo editabas. Vuelve a consultarlo.'
	if (error instanceof FirebaseError)
		return 'Correo o contraseña incorrectos.'
	return 'No pudimos completar la operación. Inténtalo nuevamente.'
}

export default function PriceAdminClient() {
	const [checkingSession, setCheckingSession] = useState(true)
	const [signedIn, setSignedIn] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [productId, setProductId] = useState('')
	const [product, setProduct] = useState<AdminProductPrice | null>(null)
	const [newPrice, setNewPrice] = useState('')
	const [loading, setLoading] = useState(false)
	const [notice, setNotice] = useState<Notice>(null)

	useEffect(() => {
		let active = true
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user || user.isAnonymous) {
				if (active) {
					setSignedIn(false)
					setCheckingSession(false)
				}
				return
			}

			try {
				await verifyAdminSession(await getAdminToken(user))
				if (active) setSignedIn(true)
			} catch (error) {
				await signOut(auth).catch(() => undefined)
				if (active) {
					setSignedIn(false)
					setNotice({ type: 'error', message: errorMessage(error) })
				}
			} finally {
				if (active) setCheckingSession(false)
			}
		})

		return () => {
			active = false
			unsubscribe()
		}
	}, [])

	const getToken = async () => {
		if (!auth.currentUser || auth.currentUser.isAnonymous)
			throw new Error('NO_SESSION')
		return getAdminToken(auth.currentUser)
	}

	const handleLogin = async (event: FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setNotice(null)
		try {
			const user = await login(email.trim(), password)
			const token = await getAdminToken(user, true)
			await verifyAdminSession(token)
			setSignedIn(true)
			setPassword('')
		} catch (error) {
			await signOut(auth).catch(() => undefined)
			setSignedIn(false)
			setNotice({ type: 'error', message: errorMessage(error) })
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = async (event: FormEvent) => {
		event.preventDefault()
		const id = productId.trim()
		if (!id) return
		setLoading(true)
		setNotice(null)
		setProduct(null)
		try {
			const result = await getAdminProduct(id, await getToken())
			setProduct(result)
			setNewPrice(result.buscorepuestosPrice.toFixed(2))
		} catch (error) {
			setNotice({ type: 'error', message: errorMessage(error) })
		} finally {
			setLoading(false)
		}
	}

	const handleUpdate = async (event: FormEvent) => {
		event.preventDefault()
		if (!product) return
		const parsedPrice = Number(newPrice.replace(',', '.'))
		if (
			!Number.isFinite(parsedPrice) ||
			parsedPrice < 0 ||
			!/^\d+(?:[.,]\d{1,2})?$/.test(newPrice.trim())
		) {
			setNotice({
				type: 'error',
				message:
					'Introduce un precio válido con un máximo de 2 decimales.',
			})
			return
		}
		setLoading(true)
		setNotice(null)
		try {
			const updated = await updateAdminProductPrice(
				product._id,
				parsedPrice,
				await getToken()
			)
			setProduct(updated)
			setNewPrice(updated.buscorepuestosPrice.toFixed(2))
			setNotice({
				type: 'success',
				message: 'Precio actualizado correctamente.',
			})
		} catch (error) {
			setNotice({ type: 'error', message: errorMessage(error) })
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = async () => {
		await signOut(auth)
		setProduct(null)
		setSignedIn(false)
		setNotice(null)
	}

	if (checkingSession)
		return (
			<main className="min-h-[70vh] grid place-items-center">
				<p>Comprobando sesión…</p>
			</main>
		)

	return (
		<main className="min-h-[75vh] px-6 pb-20 pt-[190px] mobile:px-4 mobile:pt-[90px]">
			<div className="mx-auto max-w-[960px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
				<div className="flex items-start justify-between gap-6 border-b border-slate-100 px-12 py-9 mobile:px-6 mobile:py-7">
					<div>
						<p className="mb-2 text-[1.2rem] font-bold uppercase tracking-[0.18em] text-secondary-blue">
							Acceso restringido
						</p>
						<h1 className="text-[3.2rem] text-dark-grey mobile:text-[2.6rem]">
							Administración de precios
						</h1>
						<p className="mt-3 max-w-2xl text-[1.5rem] leading-6 text-slate-600">
							Consulta el producto antes de cambiar su precio. La
							modificación se aplica al catálogo inmediatamente.
						</p>
					</div>
					{signedIn && (
						<button
							type="button"
							onClick={handleLogout}
							className="whitespace-nowrap !text-[1.3rem] !leading-5 font-semibold text-slate-600 underline"
						>
							Cerrar sesión
						</button>
					)}
				</div>

				<div className="px-12 py-10 mobile:px-6 mobile:py-7">
					{notice && (
						<div
							role="alert"
							className={`mb-7 rounded-xl border p-4 text-[1.5rem] ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}
						>
							{notice.message}
						</div>
					)}

					{!signedIn ? (
						<div className="grid grid-cols-[0.85fr_1.15fr] gap-12 mobile:grid-cols-1 mobile:gap-7">
							<aside className="rounded-2xl bg-slate-50 p-7">
								<div
									className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-[2rem] text-primary-blue"
									aria-hidden="true"
								>
									🔒
								</div>
								<h2 className="text-[2.2rem] text-dark-grey">
									Panel privado
								</h2>
								<p className="mt-3 text-[1.4rem] leading-6 text-slate-600">
									Usa la cuenta corporativa autorizada por el
									administrador. El acceso se verifica de
									forma segura antes de mostrar o modificar
									productos.
								</p>
								<p className="mt-5 text-[1.3rem] font-semibold text-slate-500">
									Si tu cuenta todavía no tiene acceso,
									solicítalo al responsable del backend.
								</p>
							</aside>
							<form
								onSubmit={handleLogin}
								className="grid content-center gap-5"
							>
								<label className="grid gap-2 text-[1.5rem] font-semibold">
									Correo electrónico
									<input
										type="email"
										autoComplete="username"
										required
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder="nombre@empresa.com"
										className="h-12 rounded-xl border border-slate-300 px-4 text-[1.5rem] font-normal outline-none transition focus:border-secondary-blue focus:ring-2 focus:ring-cyan-100"
									/>
								</label>
								<label className="grid gap-2 text-[1.5rem] font-semibold">
									Contraseña
									<input
										type="password"
										autoComplete="current-password"
										required
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										placeholder="Tu contraseña"
										className="h-12 rounded-xl border border-slate-300 px-4 text-[1.5rem] font-normal outline-none transition focus:border-secondary-blue focus:ring-2 focus:ring-cyan-100"
									/>
								</label>
								<button
									disabled={loading}
									className="mt-1 h-[42px] rounded-xl bg-primary-blue px-5 !text-[1.4rem] !leading-5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{loading ? 'Verificando…' : 'Entrar'}
								</button>
							</form>
						</div>
					) : (
						<div className="grid gap-8">
							<form
								onSubmit={handleSearch}
								className="flex items-end gap-3 mobile:flex-col mobile:items-stretch"
							>
								<label className="grid flex-1 gap-2 font-semibold">
									ID de Mongo del producto
									<input
										value={productId}
										onChange={(e) =>
											setProductId(e.target.value)
										}
										placeholder="Ej. 665f1c…"
										required
										spellCheck={false}
										className="rounded-xl border border-slate-300 px-4 py-3 font-mono text-base font-normal outline-none focus:border-secondary-blue"
									/>
								</label>
								<button
									disabled={loading}
									className="h-[40px] rounded-xl bg-secondary-blue px-5 !text-[1.4rem] !leading-5 font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{loading ? 'Consultando…' : 'Buscar'}
								</button>
							</form>

							{product && (
								<section className="rounded-2xl border border-slate-200 p-6">
									<div className="mb-7 flex gap-5 mobile:flex-col">
										{product.images?.[0] && (
											<Image
												src={product.images[0]}
												alt=""
												width={120}
												height={120}
												className="h-32 w-32 rounded-xl object-cover"
											/>
										)}
										<div className="min-w-0">
											<h2 className="text-2xl text-dark-grey">
												{product.title}
											</h2>
											<p className="mt-1 text-slate-600">
												{product.productName}
											</p>
											<p className="mt-2 break-all font-mono text-sm text-slate-500">
												{product._id}
											</p>
											<p className="mt-3 text-base">
												Precio actual:{' '}
												<strong>
													{product.buscorepuestosPrice.toFixed(
														2
													)}{' '}
													€
												</strong>
											</p>
											<Link
												href={`/producto/${product._id}`}
												target="_blank"
												className="mt-2 inline-block text-sm font-semibold text-primary-blue underline"
											>
												Ver producto en la tienda
											</Link>
										</div>
									</div>
									<form
										onSubmit={handleUpdate}
										className="flex items-end gap-3 mobile:flex-col mobile:items-stretch"
									>
										<label className="grid flex-1 gap-2 font-semibold">
											Nuevo precio (€)
											<input
												inputMode="decimal"
												value={newPrice}
												onChange={(e) =>
													setNewPrice(e.target.value)
												}
												required
												className="rounded-xl border border-slate-300 px-4 py-3 text-base font-normal outline-none focus:border-secondary-blue"
											/>
										</label>
										<button
											disabled={
												loading ||
												Number(
													newPrice.replace(',', '.')
												) ===
													product.buscorepuestosPrice
											}
											className="h-[40px] rounded-xl bg-primary-blue px-5 !text-[1.4rem] !leading-5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
										>
											{loading
												? 'Guardando…'
												: 'Actualizar precio'}
										</button>
									</form>
								</section>
							)}
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
