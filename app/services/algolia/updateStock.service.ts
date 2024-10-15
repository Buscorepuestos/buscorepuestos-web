import algoliasearch from 'algoliasearch'
import { environment } from '../../environment/environment'

// Inicializa el cliente de Algolia
const client = algoliasearch(
	environment.algoliaAppID,
	environment.algoliaAPIKey
)
const index = client.initIndex(environment.algoliaIndexName)

/**
 * Actualiza el stock de un producto en Algolia
 * @param productId El ID del producto a actualizar
 * @param stock Valor booleano que indica si el producto está en stock o no
 * @returns Una promesa que se resuelve cuando el producto ha sido actualizado
 */
export const updateAlgoliaProductStock = async (
	productId: string,
	stock: boolean
): Promise<void> => {
	try {
		await index.partialUpdateObject(
			{
				objectID: productId, // Usa el ID del producto como el identificador en Algolia
				stock: stock, // Actualiza el campo de stock
			},
			{ createIfNotExists: true }
		) // Esta opción crea el objeto si no existe
		console.log(`Producto con ID ${productId} actualizado en Algolia`)
	} catch (error) {
		console.error(
			'Error actualizando el stock del producto en Algolia:',
			error
		)
		throw error
	}
}
