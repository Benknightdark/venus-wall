import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private adminService: AdminService) { }
  chartData: Chart[] = [];
  summaryData: { forumName: string, totalCount: number }[] = [];
  adminDataSource: any[] = []
  ngOnInit(): void {
    this.adminService.getForumCount().subscribe(r => {
      this.adminDataSource = r;
    });
  }

}
