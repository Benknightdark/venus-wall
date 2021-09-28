import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private adminService:AdminService) { }
  isCollapsed = false;
  chartData:Chart[]=[];

  ngOnInit(): void {
    this.adminService.getForumCount().subscribe(r=>{
      for (const item of r) {
        const chart = new Chart({
          chart: {
            type: 'column'
          },
          title: {
            text: item.forumName!
          },
          credits: {
            enabled: false
          },
          series:item.data?.map(c=>{
            return {
              type:'column',
              name:c.Name!,
              data:[c.TotalCount!]
            }
          })
          // series: [
          //   {
          //     type: 'column',
          //     name: item.forumName!,
          //     data: item.data?.map(c=>{
          //         return {
          //           data:[c.TotalCount]
          //         }
          //       })

          //   }
          // ]
        });
        this.chartData.push(chart)
      }

  });
  }

}
