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

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ForumComponent,
    ItemComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
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
    NzImageModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_TW },NzMessageService,NzModalService,NzImageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
