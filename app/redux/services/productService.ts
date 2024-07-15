import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductMongoInterface } from "../interfaces/product.interface";
import { BaseInterface } from "../interfaces/base.interface";

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://buscorepuestos-dev.herokuapp.com/api/" }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getProductById: builder.query<ProductMongoInterface, {id: string}>({
            query: ({id}) => `products/product-mongo/${id}`,
            transformResponse: (response: { data: ProductMongoInterface }) => response.data,
            providesTags: ["Product"],
        }),
        getDistributorById: builder.query<BaseInterface<{fields: { Provincia: string, 'Media de valoración': number }}>, {id: string}>({
            query: ({id}) => `distributors/${id}?populate=true`,
            providesTags: ["Product"],
        }),
    }),
});

export const { useGetProductByIdQuery, useGetDistributorByIdQuery } = productsApi;