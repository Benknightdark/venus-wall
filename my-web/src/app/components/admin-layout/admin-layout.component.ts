import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      { label: '首頁', icon: 'pi pi-fw pi-home',routerLink:["/dashboard"] },
      { label: '管理', icon: 'pi pi-fw pi-cog' },
    ];
  }


}
