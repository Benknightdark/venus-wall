import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForumComponent } from './components/forum/forum.component';
import { ItemComponent } from './components/item/item.component';
import { WebPageComponent } from './components/web-page/web-page.component';

const routes: Routes = [
  {
    path:'dashboard',component:DashboardComponent
  },

  {
    path: 'admin', component: AdminLayoutComponent, children: [
      { path: 'webpage', component: WebPageComponent },
      { path: 'item', component: ItemComponent },
      { path: 'forum', component: ForumComponent },

      {
        path: '',
        redirectTo: 'forum',
        pathMatch: 'full'
      },
      { path: '**', component: ForumComponent }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: DashboardComponent },  // Wildcard route for a 404 page


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
