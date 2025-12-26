/**
 * Interface genérica para manejar el estado de búsqueda/peticiones asíncronas.
 * Diseñada para trabajar con Angular Signals y gestión de estado reactiva.
 */
export interface SearchState<T> {
    /**
     * Datos obtenidos de la petición.
     * - null cuando no hay datos disponibles
     * - T cuando la petición ha sido exitosa
     */
    data: T | null;

    /**
     * Indicador de carga.
     * - true cuando la petición está en progreso
     * - false cuando la petición ha finalizado (éxito o error)
     */
    loading: boolean;

    /**
     * Mensaje de error si la petición ha fallado.
     * - null cuando no hay error
     * - string con el mensaje de error cuando ha ocurrido un fallo
     */
    error: string | null;
}
