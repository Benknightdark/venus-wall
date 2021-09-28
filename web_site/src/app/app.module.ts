import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BlurHashImgComponent } from './component/blur-hash-img/blur-hash-img.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_TW } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ForumComponent } from './pages/forum/forum.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ItemComponent } from './pages/item/item.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ChartModule } from 'angular-highcharts';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ForumComponent,
    ItemComponent,
    DashboardComponent,
    AdminLayoutComponent,
    DashboardLayoutComponent,
    BlurHashImgComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzToolTipModule,
    NzDropDownModule,
    NzModalModule,
    NzFormModule,
    NzInputNumberModule ,
    NzMessageModule ,
    NzInputModule,
    NzSpaceModule,
    DragDropModule,
    NzPageHeaderModule,
    NzImageModule,
    NzGridModule,
    NzCardModule,
    NzSelectModule,
    NzBackTopModule,
    NzListModule,
    NzBadgeModule,
    NzTagModule,
    ChartModule,
    NzStatisticModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_TW },NzMessageService,NzModalService,NzImageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
