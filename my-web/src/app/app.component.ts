import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebPage } from './models/data.model';
import { DashboardService } from './services/dashboard.service';
import { SideMenuService } from './services/side-menu.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '女神牆';
  display: boolean = true;
  showSideMenu = false;
  webPageList$: Observable<WebPage[]> = of();
  selectWebPage: WebPage = {};
  constructor(private dashBoardService: DashboardService, private router: Router, private sideMenuService:SideMenuService
  ) { }
  ngOnInit() {
    this.dashBoardService.getPageListSubject();
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationStart") {
        let routerEvent = event as RouterEvent;
        console.log(routerEvent.url)
        console.log(routerEvent.url.indexOf('admin'))
        if (routerEvent.url.indexOf('admin') != -1) {
          this.showSideMenu = true;
        }else{
          this.showSideMenu=false;
        }
      }
    });

    this.webPageList$ = this.dashBoardService.webPageSubjectList$.pipe(
      tap(d => {
        this.selectWebPage = d[0];
        this.dashBoardService.setSelectPage(this.selectWebPage.ID)
      }))
  }
  onOpenSideMenu(){
      this.sideMenuService.openSideMenu();
  }
  onChangeWebPage() {
    this.dashBoardService.resetItems();
    this.dashBoardService.setSelectPage(this.selectWebPage.ID);
  }
  onScrollToTop() {

  }

}
