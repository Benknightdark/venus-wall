import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Observable } from 'rxjs';
import { SideMenuService } from '../../services/side-menu.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit,OnDestroy {

  constructor(private sideMenuService:SideMenuService) { }
  items: MenuItem[] = [];
  display:boolean=false;
  showSideMenu$!: Observable<boolean>;
  ngOnInit(): void {
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home',routerLink:["/dashboard"] },
      { label: '資料來源', icon: 'pi pi-fw pi-cog',routerLink:["/admin/webpage"]  },
    ];
    this.showSideMenu$=this.sideMenuService.showSideMenu$;
  }
  ngOnDestroy():void{
    this.sideMenuService.hideSideMenu();
  }
  loadValueChange(event:any){
    if(!event){
      this.sideMenuService.hideSideMenu();
    }
  }

}


