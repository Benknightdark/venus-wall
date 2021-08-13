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
import { ItemComponent } from './components/item/item.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {TableModule} from 'primeng/table';
import { ForumComponent } from './components/forum/forum.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {ScrollTopModule} from 'primeng/scrolltop';
import {GalleriaModule} from 'primeng/galleria';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
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
    TableModule,
    SplitButtonModule,
    ScrollPanelModule,
    DialogModule,
    PaginatorModule,
    InputNumberModule,
    ToastModule,
    ScrollTopModule,
    GalleriaModule
  ],
  providers: [  MessageService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
