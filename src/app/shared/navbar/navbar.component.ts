import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchTerm: string = '';
  lastNonSearchRoute: string = '/';
  debounceTimeout: any;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!event.url.includes('/catalogo?q=')) {
        this.lastNonSearchRoute = event.url;
      }
    });
  }

  onSearchChange() {
    clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      const termino = this.searchTerm.trim();
      if (termino) {
        this.router.navigate(['/catalogo'], { queryParams: { q: termino } });
      } else {
        this.router.navigateByUrl(this.lastNonSearchRoute);
      }
    }, 300); 
  }
}
