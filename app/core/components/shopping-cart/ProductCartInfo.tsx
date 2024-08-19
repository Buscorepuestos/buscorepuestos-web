import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { CartItem } from '../../../redux/features/shoppingCartSlice';
import { removeItemFromCart, removePurchaseAsync } from '../../../redux/features/shoppingCartSlice';
import Image from 'next/image';
import styled from 'styled-components';
import Trash from '../svg/trash';

interface ProductCartInfoProps {
	_id: string;
	images: string[];
	title: string;
	brand: string;
	articleModel: string;
	mainReference: string;
	buscorepuestosPrice: number;
	stock: boolean;
	isMobile?: boolean;
}

const Article = styled.article<{ isAvailable: boolean }>`
	display: flex;
	width: 775px;

	@media (max-width: 1024px) {
		width: 700px;
	}

	@media (max-width: 768px) {
		width: 550px;
	}

	@media (max-width: 640px) {
		width: 85vw;
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

	const { isMobile, stock, _id } = props;
	const dispatch = useAppDispatch()
	const cart = useSelector((state: RootState) => state.cart.items);
	const [existingItem, setExistingItem] = useState<CartItem | null>(null);

    useEffect(() => {
        const item = cart.find((item) => item._id === _id);
        setExistingItem(item!);
    }, [cart, _id]);

	const handleRemoveFromCart = () => {
        dispatch(removeItemFromCart(_id));
        dispatch(removePurchaseAsync({ productId: _id, purchaseId: existingItem!.purchaseId! }));
    }

	return (
		<Article isAvailable={stock} data-testid="product-cart-info">
			{!stock && <NotAvailableOverlay>No disponible</NotAvailableOverlay>}
			<Image
				src={props.images[0]}
				alt={props.title}
				width={isMobile ? 84 : 96}
				height={72}
				priority
				className="rounded-[10px] h-max"
			/>
			<div className={'flex justify-between w-full'}>
				<div className={'ml-16 tablet:ml-8 mobile:ml-4 mobile:w-full'}>
					<h1 className={'text-title-3 tablet:text-title-4 mobile:text-base font-semibold font-poppins line-clamp-1 mobile:line-clamp-2'}>{props.title}</h1>
					<h2 className={'text-sm tablet:text-xs mobile:text-xs font-poppins'}>{props.brand.toUpperCase()} {props.articleModel}</h2>
					<p className={'text-sm mobile:text-xs'}>Ref. {props.mainReference}</p>
				</div>
				<div className={'flex flex-col items-end tablet:justify-between mobile:justify-between'}>
					<button onClick={handleRemoveFromCart}>
						<Trash isFilled={true} width={15} height={16} />
					</button>
					<p className={'text-lg tablet:text-title-3 mobile:text-title-4 font-semibold text-primary-blue-2'}>{props.buscorepuestosPrice.toFixed(2)}€</p>
				</div>
			</div>
		</Article>
	);
}

export default ProductCartInfo;
