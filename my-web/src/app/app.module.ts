import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToolbarModule} from 'primeng/toolbar';
import {MenuModule} from 'primeng/menu';
import { HttpClientModule } from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { WebPageComponent } from './components/web-page/web-page.component';
import { ItemComponent } from './components/item/item.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {TableModule} from 'primeng/table';
import { ForumComponent } from './components/forum/forum.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    WebPageComponent,
    ItemComponent,
    DashboardComponent,
    ForumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ScrollingModule,
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    MenuModule,
    DropdownModule,
    CardModule,
    DividerModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
