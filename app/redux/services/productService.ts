import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductMongoInterface } from "../interfaces/product.interface";

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
    }),
});

export const { useGetProductByIdQuery } = productsApi;