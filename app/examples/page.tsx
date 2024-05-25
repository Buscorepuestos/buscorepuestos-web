import Button from '../_components/Button'
import CardPrice from '../_components/CardPrice'
import { Footer } from '../_components/global/footer'
import { Header } from '../_components/global/header'

function TitleComponentSection(props: { name: string }) {
	return <h2 className="text-4xl text-center m-0">{props.name} </h2>
}

function Divider() {
	return <div className="w-full h-0.5 bg-gray-300" />
}

export default function Components() {
	return (
		<>
			<section className="pl-4 flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<h1>Component page</h1>
				<TitleComponentSection name="Global components" />
				<Header />
				<Footer />
				<Divider />
				<TitleComponentSection name="Main components" />
				<Button />
				<Divider />
				<TitleComponentSection name="Card components" />
				<CardPrice />
			</section>
		</>
	)
}
