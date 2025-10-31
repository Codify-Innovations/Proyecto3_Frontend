import { Routes } from '@angular/router';
import { LoginComponent } from './pages/features/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/features/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AccessDeniedComponent } from './pages/features/access-denied/access-denied.component';
import { AdminRoleGuard } from './core/guards/admin-role.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { IRoleType } from './core/interfaces';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserPrivacyComponent } from './pages/user-privacy/user-privacy.component';
import { UserProfileUpdateComponent } from './pages/user-profile-update/user-profile-update.component';
import { GiftsComponent } from './pages/gifts/gifts.component';
import { GiftListGiftsComponent } from './pages/gift-list-gifts/gift-list-gifts.component';
import { LandingAutocutPage } from './pages/features/landing-autocut/page/landing.page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
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
        path: 'app',
        redirectTo: 'users',
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
        path: 'profile/privacy', 
        component: UserPrivacyComponent,
        data: {
          authorities: [
            IRoleType.admin,
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Privacidad del perfil',
          showInSidebar: true,
        },
      },
      {
        path: 'profile/update', // Nuevo path para la actualización de perfil
        component: UserProfileUpdateComponent,
        data: {
          authorities: [
            IRoleType.admin,
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'Actualizar perfil',
          showInSidebar: true,
        },
      },
    ],
  },
];

