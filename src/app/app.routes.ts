import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { HomeVendedorComponent } from './pages/home-vendedor/home-vendedor.component';
import { HomeBodegueroComponent } from './pages/home-bodeguero/home-bodeguero.component';
import { HomeContadorComponent } from './pages/home-contador/home-contador.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { authGuard } from './guards/auth.guard';
import { NoAutorizadoComponent } from './pages/no-autorizado/no-autorizado.component';
import { PagoComponent } from './pages/pago/pago.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'pago', component: PagoComponent },

  { path: 'admin', component: HomeAdminComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'vendedor', component: HomeVendedorComponent, canActivate: [authGuard], data: { roles: ['VENDEDOR', 'ADMIN'] } },
  { path: 'bodeguero', component: HomeBodegueroComponent, canActivate: [authGuard], data: { roles: ['BODEGUERO', 'ADMIN'] } },
  { path: 'contador', component: HomeContadorComponent, canActivate: [authGuard], data: { roles: ['DESPACHADOR', 'ADMIN'] } },

  { path: 'no-autorizado', component: NoAutorizadoComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
