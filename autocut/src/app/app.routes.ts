import { Routes } from '@angular/router';
import { LoginComponent } from './pages/features/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SignUpComponent } from './pages/features/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AccessDeniedComponent } from './pages/features/access-denied/access-denied.component';
import { AdminRoleGuard } from './core/guards/admin-role.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { IRoleType } from './core/interfaces';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { GiftListGiftsComponent } from './pages/gift-list-gifts/gift-list-gifts.component';
import { LandingAutocutPage } from './pages/features/landing-autocut/page/landing.page';

// ✅ Importar los componentes del perfil
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'landing',
    component: LandingPageComponent, 
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'landing-autocut',
    pathMatch: 'full',
  },
  {
    path: 'landing-autocut',
    component: LandingAutocutPage,
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: 'Users',
          showInSidebar: true,
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          authorities: [
            IRoleType.admin,
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Dashboard',
          showInSidebar: true,
        },
      },
      {
        path: 'product-categories',
        component: CategoryComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Categories',
          showInSidebar: true,
        },
      },
      {
        path: 'products',
        component: ProductComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Products',
          showInSidebar: true,
        },
      },

    
      {
        path: 'profile',
        component: UserProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Perfil',
          showInSidebar: true,
        },
      },

     
      {
        path: 'profile/settings',
        component: UserSettingsComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Configuración de Perfil',
          showInSidebar: false, 
        },
      },

      {
        path: 'gifts',
        component: GiftsComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Gifts',
          showInSidebar: true,
        },
      },
      {
        path: 'gift-list-gifts',
        component: GiftListGiftsComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: 'Gift List',
          showInSidebar: true,
        },
      },
    ],
  },
];
