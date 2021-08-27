import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebPage } from '../../models/data.model';
@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  constructor(private dashBoardService: DashboardService, private router: Router ) { }
  currentYear!:number;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPage: WebPage = {};
  ngOnInit(): void {
    this.currentYear= new Date().getFullYear();
    this.dashBoardService.getPageListSubject();
    this.webPageList$ = this.dashBoardService.webPageSubjectList$.pipe(
      tap(d => {
        this.selectWebPage = d[0];
        console.log(this.selectWebPage)
        this.dashBoardService.setSelectPage(this.selectWebPage.ID)
      }))
  }
  onChangeWebPage(data:any) {
    console.log(data)
    this.dashBoardService.resetItems();
    this.dashBoardService.setSelectPage(data);
  }

}
