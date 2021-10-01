import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private adminService: AdminService) { }
  adminDataSource: any[] = [];
  taskCountDataSource:any[]=[]
  ngOnInit(): void {
    this.adminService.getForumCount().subscribe(r => {
      this.adminDataSource = r;
    });
    this.adminService.getCrawlTaskCount().subscribe(r => {
      this.taskCountDataSource=r;
    });
  }

}
