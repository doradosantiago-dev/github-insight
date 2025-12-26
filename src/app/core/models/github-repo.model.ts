/**
 * Interface que representa un repositorio de GitHub.
 * Basada en la respuesta del endpoint GET /users/{username}/repos
 * @see https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
 */
export interface GithubRepo {
    /**
     * Identificador numérico único del repositorio
     */
    id: number;

    /**
     * Nombre del repositorio
     */
    name: string;

    /**
     * Nombre completo del repositorio incluyendo el propietario
     */
    full_name: string;

    /**
     * URL del repositorio en GitHub
     */
    html_url: string;

    /**
     * Descripción del repositorio (puede ser null si no tiene descripción)
     */
    description: string | null;

    /**
     * Número de estrellas (stars) que ha recibido el repositorio
     */
    stargazers_count: number;

    /**
     * Número de watchers (observadores) del repositorio
     */
    watchers_count: number;

    /**
     * Número de forks (bifurcaciones) del repositorio
     */
    forks_count: number;

    /**
     * Lenguaje de programación principal del repositorio (puede ser null)
     */
    language: string | null;

    /**
     * Fecha y hora de la última actualización del repositorio en formato ISO 8601
     */
    updated_at: string;
}
