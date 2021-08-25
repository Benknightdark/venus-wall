import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumComponent } from './pages/forum/forum.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/forum' },
  { path: "admin/forum", component: ForumComponent }
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
