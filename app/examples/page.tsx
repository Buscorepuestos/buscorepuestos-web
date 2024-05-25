import Button from '../_components/Button'
import CardPrice from '../_components/CardPrice'
import CardInfo from '../_components/CardInfo'
import { Footer } from '../_components/global/footer'
import { Header } from '../_components/global/header'
import BannerImage from '../_components/BannerImage'

function TitleComponentSection(props: { name: string }) {
	return <h2 className="text-title-2 text-center m-0">{props.name} </h2>
}

function Divider() {
	return <div className="w-full h-0.5 bg-gray-300" />
}

const cardPropsArray = [
	{
		title: 'Parachoques delantero',
		reference: '5FG8715S52SA',
		description: 'Mitsuha EVO III 2003',
		price: 1000,
	},
	{
		title: 'Parachoques trasero',
		reference: '7GH8715S52SA',
		description: 'Subaru Impreza 2005',
		price: 1200,
	},
	{
		title: 'Faro delantero',
		reference: '3JK9812D52SA',
		description: 'Honda Civic 2010',
		price: 800,
	},
	{
		title: 'Faro trasero',
		reference: '9PL6715S52SA',
		description: 'Toyota Corolla 2007',
		price: 750,
	},
	{
		title: 'Espejo lateral',
		reference: '1MN8715S52SA',
		description: 'Nissan Sentra 2012',
		price: 300,
	},
	{
		title: 'Rueda',
		reference: '2OP8715S52SA',
		description: 'Ford Mustang 2015',
		price: 500,
	},
]

const cardInfoPropsArray = [
	{
		title: 'Parachoques delantero',
	},
	{
		title: 'Parachoques trasero',
	},
	{
		title: 'Faro delantero',
	},
	{
		title: 'Faro trasero',
	},
	{
		title: 'Espejo lateral',
	},
	{
		title: 'Rueda',
	},
]

export default function Components() {
	return (
		<>
			<section className="p-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<h1 className="text-title-1">Component page</h1>
				<TitleComponentSection name="Global components" />
				<Header />
				<Footer />
				<Divider />
				<TitleComponentSection name="Main components" />
				<div className="flex flex-row gap-4">
					<Button />
					<Button
						type="secondary"
						labelName="Accede a todas las categorías"
					/>
				</div>
				<Divider />
				<TitleComponentSection name="Card components" />
				<h3 className="text-title-3 text-dark-grey">Card with price</h3>
				<div className="flex justify-between gap-6">
					{cardPropsArray.map((cardProps, index) => (
						<CardPrice
							key={index}
							title={cardProps.title}
							price={cardProps.price}
							description={cardProps.description}
							reference={cardProps.reference}
						/>
					))}
				</div>
				<h3 className="text-title-3 text-dark-grey">
					Card information
				</h3>
				<div className="flex justify-between gap-6">
					{cardInfoPropsArray.map((cardInfoProps, index) => (
						<CardInfo key={index} title={cardInfoProps.title} />
					))}
				</div>
				<h3 className="text-title-3 text-dark-grey">
					Banner with Image Component
				</h3>
				<BannerImage
					imgUrl="/banner-motor.webp"
					height="561px"
					aligned="center"
				>
					<h1 className="text-title-1 text-white text-center max-w-[728px]">
						ponemos a tu alcance la mayor variedad de piezas de
						coche recuperadas, reconstruidas y nuevas.
					</h1>
				</BannerImage>
			</section>
		</>
	)
}
