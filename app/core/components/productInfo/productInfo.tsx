import React from 'react'
import styled from 'styled-components'

interface ProductInfoProps {
    vehicleVersion: string;
    engine: string;
    engineCode: string;
    oemReference: string;
    observations: string;
}

const Observations = styled.p`
    text-align: justify;
    overflow-x: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
`;

const ProductInfo: React.FC<ProductInfoProps> = ({ vehicleVersion, engine, engineCode, oemReference, observations }: ProductInfoProps) => {
    return (
        <div className='flex flex-col font-tertiary-font text-[0.9vw] xl:text-[1vw] sm:text-[1.5vw] mobile:text-[2.8vw]'>
            <p className='font-semibold'>Versión del vehículo</p>
            <p>{vehicleVersion}</p>
            <p className='font-semibold'>Motor</p>
            <p>{engine}</p>
            <p className='font-semibold'>Código del motor</p>
            <p>{engineCode}</p>
            <p className='font-semibold'>Referencia principal OEM</p>
            <p>{oemReference}</p>
            <p className='font-semibold'>Observaciones</p>
            <Observations>
                {observations}
            </Observations>
        </div>
    )
}

export default ProductInfo