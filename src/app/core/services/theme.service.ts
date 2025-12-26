import { Injectable, signal, effect } from '@angular/core';

/**
 * Tipo literal para los temas disponibles en la aplicación.
 */
export type Theme = 'dark' | 'light';

/**
 * Servicio para gestionar el tema de la aplicación (Dark/Light Mode).
 * Utiliza Angular Signals para gestión reactiva del estado.
 * Persiste la preferencia del usuario en localStorage.
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    /**
     * Clave utilizada para almacenar el tema en localStorage
     * 
     * @private
     * @readonly
     */
    private readonly STORAGE_KEY = 'github-insight-theme';

    /**
     * Tema por defecto de la aplicación
     * 
     * @private
     * @readonly
     */
    private readonly DEFAULT_THEME: Theme = 'dark';

    /**
     * Signal privado que contiene el tema actual.
     * 
     * @private
     */
    private readonly themeSignal = signal<Theme>(this.getInitialTheme());

    /**
     * Computed signal público de solo lectura que expone el tema actual.
     * 
     * @public
     * @readonly
     */
    public readonly theme = this.themeSignal.asReadonly();

    /**
     * Constructor del servicio.
     * Registra un efecto que sincroniza el tema con el DOM y localStorage.
     */
    constructor() {
        // Efecto que se ejecuta cada vez que cambia el tema
        effect(() => {
            const currentTheme = this.themeSignal();
            this.applyThemeToDocument(currentTheme);
            this.saveThemeToStorage(currentTheme);
        });

        // Aplicar tema inicial al cargar
        this.applyThemeToDocument(this.themeSignal());
    }

    /**
     * Obtiene el tema inicial desde localStorage o usa el tema por defecto.
     * También verifica la preferencia del sistema si no hay tema guardado.
     * 
     * @private
     * @returns El tema inicial a aplicar
     */
    private getInitialTheme(): Theme {
        // Intentar obtener desde localStorage
        const storedTheme = this.loadThemeFromStorage();
        if (storedTheme) {
            return storedTheme;
        }

        // Verificar preferencia del sistema
        if (typeof window !== 'undefined' && window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }

        return this.DEFAULT_THEME;
    }

    /**
     * Carga el tema guardado desde localStorage.
     * 
     * @private
     * @returns El tema guardado o null si no existe
     */
    private loadThemeFromStorage(): Theme | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') {
                return stored;
            }
        } catch (error) {
            console.warn('No se pudo leer el tema desde localStorage:', error);
        }
        return null;
    }

    /**
     * Guarda el tema actual en localStorage.
     * 
     * @private
     * @param theme - Tema a guardar
     */
    private saveThemeToStorage(theme: Theme): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (error) {
            console.warn('No se pudo guardar el tema en localStorage:', error);
        }
    }

    /**
     * Aplica el tema al documento mediante el atributo data-theme.
     * También actualiza la clase del body para compatibilidad.
     * 
     * @private
     * @param theme - Tema a aplicar
     */
    private applyThemeToDocument(theme: Theme): void {
        if (typeof document !== 'undefined') {
            // Aplicar atributo data-theme al body
            document.body.setAttribute('data-theme', theme);

            // Agregar/remover clases para compatibilidad
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
            }
        }
    }

    /**
     * Alterna entre los temas disponibles (dark ↔ light).
     * @public
     */
    public toggleTheme(): void {
        const currentTheme = this.themeSignal();
        const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
        this.themeSignal.set(newTheme);
    }

    /**
     * Establece un tema específico.
     * 
     * @public
     * @param theme - Tema a establecer ('dark' | 'light')
     */
    public setTheme(theme: Theme): void {
        this.themeSignal.set(theme);
    }

    /**
     * Verifica si el tema actual es oscuro.
     * 
     * @public
     * @returns true si el tema es oscuro, false en caso contrario
     */
    public isDarkTheme(): boolean {
        return this.themeSignal() === 'dark';
    }

    /**
     * Verifica si el tema actual es claro.
     * 
     * @public
     * @returns true si el tema es claro, false en caso contrario
     */
    public isLightTheme(): boolean {
        return this.themeSignal() === 'light';
    }
}
