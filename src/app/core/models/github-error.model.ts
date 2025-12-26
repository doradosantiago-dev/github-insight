/**
 * Interface que representa un error de la API de GitHub.
 * Utilizada para capturar y tipar las respuestas de error
 * @see https://docs.github.com/en/rest/overview/resources-in-the-rest-api#client-errors
 */
export interface GithubError {
    /**
     * Mensaje descriptivo del error
     */
    message: string;

    /**
     * URL de la documentación oficial para más información sobre el error
     */
    documentation_url: string;
}
