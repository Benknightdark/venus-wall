import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ChartModule } from 'angular-highcharts';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule } from '@angular/common/http';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChartModule,
    NzStatisticModule,
    NzGridModule,
    NzIconModule,
    HttpClientModule,
    NzTypographyModule
  ],
  providers: [],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const customElement = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('admin-dashboard-component', customElement);
  }
 }
