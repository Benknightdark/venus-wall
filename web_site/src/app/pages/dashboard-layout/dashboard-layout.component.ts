import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ForumWebpageList, WebPage } from '../../models/data.model';
@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  constructor(private dashBoardService: DashboardService, private router: Router ) { }
  currentYear!:number;
  forumWebPageList$: Observable<ForumWebpageList[]> = of();
  selectWebPageID: string |undefined= "";
  ngOnInit(): void {
    this.currentYear= new Date().getFullYear();
    this.dashBoardService.getPageListSubject();
    this.forumWebPageList$ = this.dashBoardService.webPageSubjectList$.pipe(
      tap(d => {
        console.log(d)
        this.selectWebPageID = (d[0].WebPageList!)[0].ID;
        this.dashBoardService.resetItems();
        this.dashBoardService.setSelectWebPage(this.selectWebPageID)
      }))
  }
  onRefreshDashboard(){
    this.dashBoardService.resetItems();
    this.dashBoardService.setSelectWebPage(this.selectWebPageID);
  }
  onChangeWebPage(id:any) {
    this.selectWebPageID = id;
    this.dashBoardService.resetItems();
    this.dashBoardService.setSelectWebPage(this.selectWebPageID);
  }
}
