import Image from 'next/image'
export default function SearchBar() {
	return (
		<section
			className="relative flex items-center border-[1px] bg-custom-white 
    border-dark-grey rounded-[34px] w-full h-[44px] pl-4"
		>
			<Image
				src="/search-icon.svg"
				alt="icon"
				width={25}
				height={25}
				priority
				className="mr-[20px]"
			/>
			<input
				className="text-base text-dark-grey flex-grow bg-transparent outline-none"
				type="text"
				placeholder="Escribe lo que necesitas"
			/>
		</section>
	)
}
