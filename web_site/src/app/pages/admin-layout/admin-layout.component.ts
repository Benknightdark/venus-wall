import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor(private adminService:AdminService) { }
  isCollapsed = false;
  chartData:Chart[]=[];
  ngOnInit(): void {

  }

}
