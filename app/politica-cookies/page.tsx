import React from 'react'

const page = () => {
	return (
		<div className="container mx-auto p-4 mt-10 font-tertiary-font text-justify">
			<h1 className='font-tertiary-font font-bold mt-4'>Política de Cookies</h1>
			<p className='mt-4'>
				En esta web se utilizan cookies de terceros y propias para
				conseguir que tengas una mejor experiencia de navegación, puedas
				compartir contenido en redes sociales y para que podamos obtener
				estadísticas de los usuarios.
				<br />
				<br />
				Puedes evitar la descarga de cookies a través de la
				configuración de tu navegador, evitando que las cookies se
				almacenen en su dispositivo.
				<br />
				<br />
				Como propietario de este sitio web, te comunico que no
				utilizamos ninguna información personal procedente de cookies,
				tan sólo realizamos estadísticas generales de visitas que no
				suponen ninguna información personal.
				<br />
				<br />
				Es muy importante que leas la presente política de cookies y
				comprendas que, si continúas navegando, consideraremos que
				aceptas su uso.
				<br />
				<br />
				Según los términos incluidos en el artículo 22.2 de la Ley
				34/2002 de Servicios de la Sociedad de la Información y Comercio
				Electrónico, si continúas navegando, estarás prestando tu
				consentimiento para el empleo de los referidos mecanismos.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Entidad Responsable</h2>
			<p className='mt-4'>
				La entidad responsable de la recogida, procesamiento y
				utilización de tus datos personales, en el sentido establecido
				por la Ley de Protección de Datos Personales es la página
				www.buscorepuestos.com, propiedad de Manuel Jesús Pérez Ortega –
				C/ Valladolid 25 , 35110 Vecindario, Las Palmas
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>¿Qué son las cookies?</h2>
			<p className='mt-4'>
				Las cookies son un conjunto de datos que un servidor deposita en
				el navegador del usuario para recoger la información de registro
				estándar de Internet y la información del comportamiento de los
				visitantes en un sitio web. Es decir, se trata de pequeños
				archivos de texto que quedan almacenados en el disco duro del
				ordenador y que sirven para identificar al usuario cuando se
				conecta nuevamente al sitio web. Su objetivo es registrar la
				visita del usuario y guardar cierta información. Su uso es común
				y frecuente en la web ya que permite a las páginas funcionar de
				manera más eficiente y conseguir una mayor personalización y
				análisis sobre el comportamiento del usuario.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>¿Qué tipos de cookies existen?</h2>
			<p className='mt-4'>
				Las cookies utilizadas en nuestro sitio web, son de sesión y de
				terceros, y nos permiten almacenar y acceder a información
				relativa al idioma, el tipo de navegador utilizado, y otras
				características generales predefinidas por el usuario, así como,
				seguir y analizar la actividad que lleva a cabo, con el objeto
				de introducir mejoras y prestar nuestros servicios de una manera
				más eficiente y personalizada. <br />
				<br />
				Las cookies, en función de su permanencia, pueden dividirse en
				cookies de sesión o permanentes. Las que expiran cuando el
				usuario cierra el navegador. Las que expiran en función de
				cuando se cumpla el objetivo para el que sirven (por ejemplo,
				para que el usuario se mantenga identificado en los servicios de
				Manuel Jesús Pérez Ortega) o bien cuando se borran manualmente.
				<br />
				<br />
			</p>
			{/* Tabla */}
            <div className="mt-6 overflow-x-auto">
					<table className="min-w-full table-auto border-collapse">
						<thead>
							<tr className="bg-gray-200 text-left">
								<th className="px-4 py-2 border-b">Nombre</th>
								<th className="px-4 py-2 border-b">Tipo</th>
								<th className="px-4 py-2 border-b">Caducidad</th>
								<th className="px-4 py-2 border-b">Finalidad</th>
								<th className="px-4 py-2 border-b">Clase</th>
							</tr>
						</thead>
						<tbody>
							<tr className="bg-white hover:bg-gray-50">
								<td className="px-4 py-2 border-b">__utma</td>
								<td className="px-4 py-2 border-b">De Terceros (Google Analytics)</td>
								<td className="px-4 py-2 border-b">2 años</td>
								<td className="px-4 py-2 border-b">Se usa para distinguir usuarios y sesiones</td>
								<td className="px-4 py-2 border-b">No Exenta</td>
							</tr>
							<tr className="bg-white hover:bg-gray-50">
								<td className="px-4 py-2 border-b">__utmb</td>
								<td className="px-4 py-2 border-b">De Terceros (Google Analytics)</td>
								<td className="px-4 py-2 border-b">30 minutos</td>
								<td className="px-4 py-2 border-b">Se usa para determinar nuevas sesiones o visitas</td>
								<td className="px-4 py-2 border-b">No Exenta</td>
							</tr>
							<tr className="bg-white hover:bg-gray-50">
								<td className="px-4 py-2 border-b">__utmc</td>
								<td className="px-4 py-2 border-b">De Terceros (Google Analytics)</td>
								<td className="px-4 py-2 border-b">Al finalizar la sesión</td>
								<td className="px-4 py-2 border-b">Se configura para su uso con Urchin</td>
								<td className="px-4 py-2 border-b">No Exenta</td>
							</tr>
							<tr className="bg-white hover:bg-gray-50">
								<td className="px-4 py-2 border-b">__utmz</td>
								<td className="px-4 py-2 border-b">De Terceros (Google Analytics)</td>
								<td className="px-4 py-2 border-b">6 meses</td>
								<td className="px-4 py-2 border-b">
									Almacena el origen o la campaña que explica cómo el usuario ha llegado hasta la página web
								</td>
								<td className="px-4 py-2 border-b">No Exenta</td>
							</tr>
						</tbody>
					</table>
				</div>
			<p className='mt-4'>
				Adicionalmente, en función de su objetivo, las cookies pueden
				clasificarse de la siguiente forma:
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies de rendimiento</h2>
			<p className='mt-4'> 
				Este tipo de Cookie recuerda sus preferencias para las
				herramientas que se encuentran en los servicios, por lo que no
				tiene que volver a configurar el servicio cada vez que usted
				visita. A modo de ejemplo, en esta tipología se incluyen:
				Ajustes de volumen de reproductores de vídeo o sonido. Las
				velocidades de transmisión de vídeo que sean compatibles con su
				navegador. Los objetos guardados en el “carrito de la compra” en
				los servicios de e-commerce tales como tiendas.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies de geo-localización</h2>
			<p className='mt-4'>
				Estas cookies son utilizadas para averiguar en qué país se
				encuentra cuando se solicita un servicio. Esta cookie es
				totalmente anónima, y sólo se utiliza para ayudar a orientar el
				contenido a su ubicación.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies de registro</h2>
			<p className='mt-4'>
				Las cookies de registro se generan una vez que el usuario se ha
				registrado o posteriormente ha abierto su sesión, y se utilizan
				para identificarle en los servicios con los siguientes
				objetivos: <br />
				<br />
				Mantener al usuario identificado de forma que, si cierra un
				servicio, el navegador o el ordenador y en otro momento u otro
				día vuelve a entrar en dicho servicio, seguirá identificado,
				facilitando así su navegación sin tener que volver a
				identificarse. Esta funcionalidad se puede suprimir si el
				usuario pulsa la funcionalidad [cerrar sesión], de forma que
				esta cookie se elimina y la próxima vez que entre en el servicio
				el usuario tendrá que iniciar sesión para estar identificado.
				<br />
				<br />
				Comprobar si el usuario está autorizado para acceder a ciertos
				servicios, por ejemplo, para participar en un concurso.
				<br />
				<br />
				Adicionalmente, algunos servicios pueden utilizar conectores con
				redes sociales tales como Facebook o Twitter. Cuando el usuario
				se registra en un servicio con credenciales de una red social,
				autoriza a la red social a guardar una Cookie persistente que
				recuerda su identidad y le garantiza acceso a los servicios
				hasta que expira. El usuario puede borrar esta Cookie y revocar
				el acceso a los servicios mediante redes sociales actualizando
				sus preferencias en la red social que específica.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies de analíticas</h2>
			<p className='mt-4'>
				Cada vez que un usuario visita un servicio, una herramienta de
				un proveedor externo genera una cookie analítica en el ordenador
				del usuario. Esta cookie que sólo se genera en la visita,
				servirá en próximas visitas a los servicios de Manuel Jesús
				Pérez Ortega para identificar de forma anónima al visitante. Los
				objetivos principales que se persiguen son:
				<br />
				<br />
				Permitir la identificación anónima de los usuarios navegantes a
				través de la cookie (identifica navegadores y dispositivos, no
				personas) y por lo tanto la contabilización aproximada del
				número de visitantes y su tendencia en el tiempo.
				<br />
				<br />
				Identificar de forma anónima los contenidos más visitados y por
				lo tanto más atractivos para los usuarios Saber si el usuario
				que está accediendo es nuevo o repite visita.
				<br />
				<br />
				Importante: Salvo que el usuario decida registrarse en un
				servicio de Manuel Jesús Pérez Ortega, la cookie nunca irá
				asociada a ningún dato de carácter personal que pueda
				identificarle. Dichas cookies sólo serán utilizadas con
				propósitos estadísticos que ayuden a la optimización de la
				experiencia de los usuarios en el sitio.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies de publicidad</h2>
			<p className='mt-4'>
				Este tipo de cookies permiten ampliar la información de los
				anuncios mostrados a cada usuario anónimo en los servicios de
				Manuel Jesús Pérez Ortega. Entre otros, se almacena la duración
				o frecuencia de visualización de posiciones publicitarias, la
				interacción con las mismas, o los patrones de navegación y/o
				comportamientos del usuario ya que ayudan a conformar un perfil
				de interés publicitario. De este modo, permiten ofrecer
				publicidad afín a los intereses del usuario.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Cookies publicitarias de terceros</h2>
			<p className='mt-4'>
				Además de la publicidad gestionada por las webs de Manuel Jesús
				Pérez Ortega en sus servicios, las webs de Manuel Jesús Pérez
				Ortega ofrecen a sus anunciantes la opción de servir anuncios a
				través de terceros (“Ad-Servers”). De este modo, estos terceros
				pueden almacenar cookies enviadas desde los servicios de Manuel
				Jesús Pérez Ortega procedentes de los navegadores de los
				usuarios, así como acceder a los datos que en ellas se guardan.
				<br />
				<br />
				Las empresas que generan estas cookies tienen sus propias
				políticas de privacidad. En la actualidad, las webs de Manuel
				Jesús Pérez Ortega utilizan la plataforma Doubleclick (Google)
				para gestionar estos servicios. Para más información, acuda a &nbsp;
				<a href="http://www.google.es/policies/privacy/ads/#toc-doubleclick" className='text-primary-blue'> 
					http://www.google.es/policies/privacy/ads/#toc-doubleclick
				</a>
				&nbsp; y a &nbsp;
				<a href="http://www.google.es/policies/privacy/ads/" className='text-primary-blue'>
					http://www.google.es/policies/privacy/ads/
				</a>
				.
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>¿Cómo puedo deshabilitar las cookies en mi navegador?</h2>
			<p className='mt-4'>
				Se pueden configurar los diferentes navegadores para avisar al
				usuario de la recepción de cookies y, si se desea, impedir su
				instalación en el equipo. Asimismo, el usuario puede revisar en
				su navegador qué cookies tiene instaladas y cuál es el plazo de
				caducidad de las mismas, pudiendo eliminarlas. <br />
				<br />
				Para ampliar esta información consulte las instrucciones y
				manuales de su navegador: <br />
				<br />
				Para más información sobre la administración de las cookies en
				Google Chrome:
				<a href="https://support.google.com/chrome/answer/95647?hl=es" className='text-primary-blue'>
					https://support.google.com/chrome/answer/95647?hl=es
				</a>
				<br />
				<br />
				Para más información sobre la administración de las cookies en
				Internet Explorer:
				<a href="http://windows.microsoft.com/es-es/windows-vista/cookies-frequently-asked-questions" className='text-primary-blue'>
					http://windows.microsoft.com/es-es/windows-vista/cookies-frequently-asked-questions
				</a>
				<br />
				<br />
				Para más información sobre la administración de las cookies en
				Mozilla Firefox:
				<a href="http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we" className='text-primary-blue'>
					http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we
				</a>
				<br />
				<br />
				Para más información sobre la administración de las cookies en
				Safari:
				<a href="http://www.apple.com/es/privacy/use-of-cookies/" className='text-primary-blue'>
					http://www.apple.com/es/privacy/use-of-cookies/
				</a>
				<br />
				<br />
				Para más información sobre la administración de las cookies en
				Opera:
				<a href="http://help.opera.com/Windows/11.50/es-ES/cookies.html" className='text-primary-blue'>
					http://help.opera.com/Windows/11.50/es-ES/cookies.html
				</a>
				<br />
				<br />
				Si desea dejar de ser seguido por Google Analytics visite:
				<a href="http://tools.google.com/dlpage/gaoptout" className='text-primary-blue'>
					http://tools.google.com/dlpage/gaoptout
				</a>
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>Para saber más sobre las cookies</h2>
			<p className='mt-4'>
				Puede obtener más información sobre la publicidad online basada
				en el comportamiento y la privacidad online en el siguiente
				enlace:
				<a href="http://www.youronlinechoices.com/es/" className='text-primary-blue'>
					http://www.youronlinechoices.com/es/
				</a>
				<br />
				<br />
				Protección de datos de Google Analytics:
				<a href="http://www.google.com/analytics/learn/privacy.html" className='text-primary-blue'>
					http://www.google.com/analytics/learn/privacy.html
				</a>
				<br />
				<br />
				Cómo usa Google Analytics las cookies:
				<a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=es#analyticsjs" className='text-primary-blue'>
					https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=es#analyticsjs
				</a>
			</p>

			<h2 className='font-tertiary-font font-bold mt-4'>
				Actualizaciones y cambios en la política de privacidad/cookies
			</h2>
			<p id="final-p" className='mt-4 mb-8'>
				Las webs de Manuel Jesús Pérez Ortega pueden modificar esta
				Política de Cookies en función de exigencias legislativas,
				reglamentarias, o con la finalidad de adaptar dicha política a
				las instrucciones dictadas por la Agencia Española de Protección
				de Datos, por ello se aconseja a los usuarios que la visiten
				periódicamente. <br />
				<br />
				Cuando se produzcan cambios significativos en esta Política de
				Cookies, estos se comunicarán a los usuarios bien mediante la
				web o a través de correo electrónico a los usuarios registrados.
			</p>
		</div>
	)
}

export default page
