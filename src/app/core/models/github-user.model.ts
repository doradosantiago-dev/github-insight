/**
 * Interface que representa un usuario de GitHub.
 * Basada en la respuesta del endpoint GET /users/{username}
 * @see https://docs.github.com/en/rest/users/users#get-a-user
 */
export interface GithubUser {
    /**
     * Nombre de usuario único en GitHub
     */
    login: string;

    /**
     * Identificador numérico único del usuario
     */
    id: number;

    /**
     * URL de la imagen de perfil del usuario
     */
    avatar_url: string;

    /**
     * URL del perfil público del usuario en GitHub
     */
    html_url: string;

    /**
     * Nombre completo del usuario (puede ser null si no está configurado)
     */
    name: string | null;

    /**
     * Compañía u organización del usuario (puede ser null)
     */
    company: string | null;

    /**
     * URL del blog o sitio web personal (puede ser null o string vacío)
     */
    blog: string | null;

    /**
     * Ubicación geográfica del usuario (puede ser null)
     */
    location: string | null;

    /**
     * Correo electrónico público del usuario (puede ser null)
     */
    email: string | null;

    /**
     * Biografía o descripción personal del usuario (puede ser null)
     */
    bio: string | null;

    /**
     * Número total de repositorios públicos del usuario
     */
    public_repos: number;

    /**
     * Número de seguidores del usuario
     */
    followers: number;

    /**
     * Número de usuarios que el usuario está siguiendo
     */
    following: number;

    /**
     * Fecha y hora de creación de la cuenta en formato ISO 8601
     */
    created_at: string;
}
