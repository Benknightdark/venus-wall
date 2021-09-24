import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumComponent } from './pages/forum/forum.component';
import { ItemComponent } from './pages/item/item.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '', component: DashboardLayoutComponent, children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "dashboard/:id", component: DashboardComponent },
    ]
  },

  {
    path: 'admin', component: AdminLayoutComponent, children: [
      { path: 'item/:id', component: ItemComponent },
      { path: 'forum', component: ForumComponent },
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { path: '**', component: AdminDashboardComponent }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: DashboardComponent }

  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
