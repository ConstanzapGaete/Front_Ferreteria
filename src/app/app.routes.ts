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


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: HomeAdminComponent  },
  { path: 'vendedor', component: HomeVendedorComponent },
  { path: 'bodeguero', component: HomeBodegueroComponent },
  { path: 'contador', component: HomeContadorComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
