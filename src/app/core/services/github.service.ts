import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';
import { GithubUser, GithubRepo, GithubError, SearchState } from '../models';

/**
 * Servicio para interactuar con la API de GitHub.
 * Implementa gestión de estado reactivo usando Angular Signals.
 */
@Injectable({
    providedIn: 'root'
})
export class GithubService {
    /**
     * Cliente HTTP inyectado usando la función inject()
     * @private
     */
    private readonly http = inject(HttpClient);

    /**
     * URL base de la API de GitHub v3
     * @private
     * @readonly
     */
    private readonly apiUrl = 'https://api.github.com';

    /**
     * Signal privado que contiene el estado completo de la búsqueda.
     * No se expone directamente para mantener la encapsulación.
     * @private
     */
    private readonly searchState = signal<SearchState<GithubUser>>({
        data: null,
        loading: false,
        error: null
    });

    /**
     * Signal privado que contiene el estado de los repositorios del usuario.
     * No se expone directamente para mantener la encapsulación.
     * @private
     */
    private readonly reposState = signal<SearchState<GithubRepo[]>>({
        data: null,
        loading: false,
        error: null
    });

    /**
     * Computed signal de solo lectura que expone los datos del usuario.
     * Retorna null cuando no hay datos disponibles.
     * 
     * @returns El usuario de GitHub o null
     */
    public readonly user = computed(() => this.searchState().data);

    /**
     * Computed signal de solo lectura que indica si hay una petición en curso.
     * 
     * @returns true si está cargando, false en caso contrario
     */
    public readonly isLoading = computed(() => this.searchState().loading);

    /**
     * Computed signal de solo lectura que expone el mensaje de error.
     * Retorna null cuando no hay error.
     * 
     * @returns El mensaje de error o null
     */
    public readonly error = computed(() => this.searchState().error);

    /**
     * Computed signal de solo lectura que expone los repositorios del usuario.
     * Retorna null cuando no hay datos disponibles o un array vacío si no tiene repos.
     * 
     * @returns Array de repositorios de GitHub o null
     */
    public readonly repos = computed(() => this.reposState().data);

    /**
     * Computed signal de solo lectura que indica si se están cargando repositorios.
     * 
     * @returns true si está cargando repos, false en caso contrario
     */
    public readonly isLoadingRepos = computed(() => this.reposState().loading);

    /**
     * Computed signal de solo lectura que expone el error de carga de repositorios.
     * Retorna null cuando no hay error.
     * 
     * @returns El mensaje de error de repos o null
     */
    public readonly reposError = computed(() => this.reposState().error);

    /**
     * Busca un usuario de GitHub por su nombre de usuario.
     * Gestiona el ciclo completo del estado: loading, success y error.
     * 
     * @param username - Nombre de usuario de GitHub a buscar
     * 
     * @throws No lanza excepciones, los errores se capturan y almacenan en el estado
     * 
     * @see https://docs.github.com/en/rest/users/users#get-a-user
     */
    public searchUser(username: string): void {
        // Validación básica del input
        if (!username || username.trim().length === 0) {
            this.searchState.set({
                data: null,
                loading: false,
                error: 'El nombre de usuario no puede estar vacío'
            });
            return;
        }

        // Establecer estado de carga
        this.searchState.set({
            data: null,
            loading: true,
            error: null
        });

        // Realizar petición HTTP
        this.http.get<GithubUser>(`${this.apiUrl}/users/${username.trim()}`)
            .pipe(
                tap((user: GithubUser) => {
                    // Actualizar estado con datos exitosos
                    this.searchState.set({
                        data: user,
                        loading: false,
                        error: null
                    });

                    // Cargar repositorios automáticamente después de obtener el usuario
                    this.getUserRepos(user.login);
                }),
                catchError((error: HttpErrorResponse) => {
                    // Manejar diferentes tipos de errores HTTP
                    let errorMessage: string;

                    if (error.status === 404) {
                        errorMessage = `Usuario "${username}" no encontrado`;
                    } else if (error.status === 403) {
                        errorMessage = 'Límite de solicitudes excedido. Intenta más tarde';
                    } else if (error.status === 0) {
                        errorMessage = 'Error de conexión. Verifica tu internet';
                    } else {
                        // Intentar extraer el mensaje del error de GitHub
                        const githubError = error.error as GithubError;
                        errorMessage = githubError?.message || 'Error al buscar usuario';
                    }

                    // Actualizar estado con error
                    this.searchState.set({
                        data: null,
                        loading: false,
                        error: errorMessage
                    });

                    // Retornar observable vacío para completar el stream
                    return of(null);
                })
            )
            .subscribe();
    }

    /**
     * Obtiene los repositorios públicos de un usuario de GitHub.
     * Los ordena por fecha de actualización (más recientes primero).
     * 
     * @param username - Nombre de usuario de GitHub
     * 
     * @throws No lanza excepciones, los errores se capturan y almacenan en el estado
     * 
     * @see https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
     */
    public getUserRepos(username: string): void {
        // Validación básica del input
        if (!username || username.trim().length === 0) {
            this.reposState.set({
                data: null,
                loading: false,
                error: 'El nombre de usuario no puede estar vacío'
            });
            return;
        }

        // Establecer estado de carga
        this.reposState.set({
            data: null,
            loading: true,
            error: null
        });

        // Realizar petición HTTP con parámetros de ordenamiento
        this.http.get<GithubRepo[]>(
            `${this.apiUrl}/users/${username.trim()}/repos`,
            {
                params: {
                    sort: 'updated',
                    direction: 'desc',
                    per_page: '30'
                }
            }
        )
            .pipe(
                tap((repos: GithubRepo[]) => {
                    // Actualizar estado con datos exitosos
                    this.reposState.set({
                        data: repos,
                        loading: false,
                        error: null
                    });
                }),
                catchError((error: HttpErrorResponse) => {
                    // Manejar diferentes tipos de errores HTTP
                    let errorMessage: string;

                    if (error.status === 404) {
                        errorMessage = 'Repositorios no encontrados';
                    } else if (error.status === 403) {
                        errorMessage = 'Límite de solicitudes excedido al cargar repositorios';
                    } else if (error.status === 0) {
                        errorMessage = 'Error de conexión al cargar repositorios';
                    } else {
                        // Intentar extraer el mensaje del error de GitHub
                        const githubError = error.error as GithubError;
                        errorMessage = githubError?.message || 'Error al cargar repositorios';
                    }

                    // Actualizar estado con error
                    this.reposState.set({
                        data: null,
                        loading: false,
                        error: errorMessage
                    });

                    // Retornar observable vacío para completar el stream
                    return of(null);
                })
            )
            .subscribe();
    }

    /**
     * Limpia el estado actual de búsqueda y repositorios.
     * Útil para resetear la UI o limpiar resultados anteriores.
     */
    public clearSearch(): void {
        this.searchState.set({
            data: null,
            loading: false,
            error: null
        });
        this.reposState.set({
            data: null,
            loading: false,
            error: null
        });
    }
}
