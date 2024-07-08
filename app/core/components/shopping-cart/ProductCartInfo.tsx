import Image from 'next/image';
import styled from 'styled-components';
import Trash from '../svg/trash';

interface ProductCartInfoProps {
	image: string;
	title: string;
	brand: string;
	model: string;
	ref: string;
	price: number;
	isMobile: boolean;
	isAvailable: boolean;
}

const Article = styled.article<{ isAvailable: boolean }>`
	display: flex;
	width: 775px;

	@media (max-width: 1024px) {
		width: 500px;
	}

	@media (max-width: 768px) {
		width: 320px;
	}

	background-color: ${({ isAvailable }) => (isAvailable ? '' : 'rgba(0, 0, 0, 0.1)')};
	opacity: ${({ isAvailable }) => (isAvailable ? 1 : 0.5)};
	position: relative;
`;

const NotAvailableOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	font-weight: bold;
	font-size: 18px;
	text-align: center;
`;

const ProductCartInfo: React.FC<ProductCartInfoProps> = (props) => {
	const { isMobile = false, isAvailable } = props;

	const parsePrice = (price: number) => {
		return price.toString().replace('.', ',');
	}

	return (
		<Article isAvailable={isAvailable} data-testid="product-cart-info">
			{!isAvailable && <NotAvailableOverlay>No disponible</NotAvailableOverlay>}
			<Image
				src={props.image}
				alt={props.title}
				width={isMobile ? 84 : 96}
				height={72}
				priority
				className="rounded-[10px] h-max"
			/>
			<div className={'flex justify-between w-full'}>
				<div className={'ml-16 tablet:ml-8 mobile:ml-4 w-[40vw] mobile:w-full'}>
					<h1 className={'text-title-3 tablet:text-title-4 mobile:text-base font-semibold font-poppins line-clamp-1 mobile:line-clamp-2'}>{props.title}</h1>
					<h2 className={'text-sm tablet:text-xs mobile:text-xs font-poppins'}>{props.brand.toUpperCase()} {props.model.toUpperCase()}</h2>
					<p className={'text-sm mobile:text-xs'}>Ref. {props.ref}</p>
				</div>
				<div className={'flex flex-col items-end tablet:justify-between mobile:justify-between'}>
					<Trash isFilled={true} width={15} height={16} />
					<p className={'text-lg tablet:text-title-3 mobile:text-title-4 font-semibold text-primary-blue-2'}>{parsePrice(props.price)}€</p>
				</div>
			</div>
		</Article>
	);
}

export default ProductCartInfo;
