import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../core/services/github.service';
import { ThemeService } from '../../core/services/theme.service';
import { LucideAngularModule, Search, Building2, MapPin, Mail, Link2, Calendar, AlertTriangle, X, Star, GitFork, Sun, Moon } from 'lucide-angular';

/**
 * Componente de búsqueda de usuarios de GitHub.
 */
@Component({
    selector: 'app-search',
    standalone: true,
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    // Iconos de Lucide
    readonly SearchIcon = Search;
    readonly Building2Icon = Building2;
    readonly MapPinIcon = MapPin;
    readonly MailIcon = Mail;
    readonly Link2Icon = Link2;
    readonly CalendarIcon = Calendar;
    readonly AlertTriangleIcon = AlertTriangle;
    readonly XIcon = X;
    readonly StarIcon = Star;
    readonly GitForkIcon = GitFork;
    readonly SunIcon = Sun;
    readonly MoonIcon = Moon;

    /**
     * Servicio de GitHub inyectado usando inject()
     * 
     * @private
     * @readonly
     */
    private readonly githubService = inject(GithubService);

    /**
     * Servicio de Tema inyectado usando inject()
     * 
     * @public
     * @readonly
     */
    public readonly themeService = inject(ThemeService);

    /**
     * Signal que almacena el valor actual del input de búsqueda
     * 
     * @public
     */
    public searchQuery = signal<string>('');

    /**
     * Computed signal que expone el usuario actual desde el servicio
     * 
     * @public
     * @readonly
     */
    public readonly user = this.githubService.user;

    /**
     * Computed signal que indica si hay una petición en curso
     * 
     * @public
     * @readonly
     */
    public readonly isLoading = this.githubService.isLoading;

    /**
     * Computed signal que expone el error actual si existe
     * 
     * @public
     * @readonly
     */
    public readonly error = this.githubService.error;

    /**
     * Computed signal que expone los repositorios del usuario
     * 
     * @public
     * @readonly
     */
    public readonly repos = this.githubService.repos;

    /**
     * Computed signal que indica si se están cargando los repositorios
     * 
     * @public
     * @readonly
     */
    public readonly isLoadingRepos = this.githubService.isLoadingRepos;

    /**
     * Computed signal que expone el error de carga de repositorios
     * 
     * @public
     * @readonly
     */
    public readonly reposError = this.githubService.reposError;

    /**
     * Maneja el evento de búsqueda cuando el usuario presiona Enter.
     * Valida que el input no esté vacío antes de realizar la búsqueda.
     * 
     * @public
     */
    public onSearch(): void {
        const query = this.searchQuery().trim();

        if (query.length > 0) {
            this.githubService.searchUser(query);
        }
    }

    /**
     * Limpia el input de búsqueda y resetea el estado del servicio.
     * 
     * @public
     */
    public onClear(): void {
        this.searchQuery.set('');
        this.githubService.clearSearch();
    }

    /**
     * Formatea la fecha de creación de la cuenta en formato legible.
     * 
     * @param dateString - Fecha en formato ISO 8601
     * @returns Fecha formateada en español
     */
    public formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Formatea la fecha de actualización de un repositorio de forma relativa.
     * 
     * @param dateString - Fecha en formato ISO 8601
     * @returns Fecha formateada de forma relativa ("hace X días")
     */
    public formatRelativeDate(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'hoy';
        if (diffInDays === 1) return 'hace 1 día';
        if (diffInDays < 7) return `hace ${diffInDays} días`;
        if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} semanas`;
        if (diffInDays < 365) return `hace ${Math.floor(diffInDays / 30)} meses`;
        return `hace ${Math.floor(diffInDays / 365)} años`;
    }
}
