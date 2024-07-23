import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import { ProductMongoInterface } from "../interfaces/product.interface";
import { BaseInterface } from "../interfaces/base.interface";
import { HYDRATE } from "next-redux-wrapper";

const isHydrateAction = (action: Action): action is PayloadAction<any> => action.type === HYDRATE;

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://buscorepuestos-dev.herokuapp.com/api/" }),
    tagTypes: ["Product"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (isHydrateAction(action)) {
            return action.payload[reducerPath];
        }
    },
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

export const { 
    useGetProductByIdQuery, 
    useGetDistributorByIdQuery,
    util: { getRunningQueriesThunk }
} = productsApi;

//endpoints for use in SSR
export const { getProductById, getDistributorById } = productsApi.endpoints;