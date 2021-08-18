import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebPage } from './models/data.model';
import { DashboardService } from './services/dashboard.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '女神牆';
  display: boolean = true;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPage: WebPage = {};
  constructor(private dashBoardService: DashboardService
  ) { }
  ngOnInit() {
    // this.webPageList$ = this.dashBoardService.getPageList().pipe(
    //   tap(d => {
    //     this.selectWebPage = d[0];
    //     this.dashBoardService.setSelectPage(this.selectWebPage.ID)
    //   }));
      this.dashBoardService.getPageListSubject();
      this.webPageList$ =this.dashBoardService.webPageSubjectList$.pipe(
        tap(d => {
          this.selectWebPage = d[0];
          this.dashBoardService.setSelectPage(this.selectWebPage.ID)
        }))
  }
  onChangeWebPage() {
    this.dashBoardService.resetItems();
    this.dashBoardService.setSelectPage(this.selectWebPage.ID);
  }
  onScrollToTop(){

  }

}
