import { Component, Input, OnChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  templateUrl: './app.component.html',
  styles: ['']

})
export class AppComponent implements OnChanges {
  @Input() adminDataSource: any[] = []
  @Input() taskCountDataSource:any[]=[]
  chartData: Chart[] = [];
  summaryData: { forumName: string, totalCount: number }[] = []
  ngOnChanges(): void {
    console.log(this.adminDataSource)
    for (const item of this.adminDataSource) {
      let totalCountTemp = 0;
      const chart = new Chart({
        chart: {
          type: 'bar'
        },
        title: {
          text: item.forumName!
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '【{point.series.name}】文章數量： <b>{point.y:.1f}</b>'
        },
        xAxis: {
          lineWidth: 0,
          minorGridLineWidth: 0,
          labels: {
            enabled: false
          },
          minorTickLength: 0,
          tickLength: 0
        },
        yAxis: {
          min: 0,
          title: {
            text: '文章數量'
          }
        },
        series: item.data?.map((c: any) => {
          totalCountTemp += c.TotalCount!;
          return {
            type: 'bar',
            name: c.Name!,
            data: [c.TotalCount!],
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              align: 'right',
              format: '{point.series.name} - {point.y:.1f}', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '13px',
              }
            }
          }
        })
      });
      this.summaryData.push({ 'forumName': item.forumName!, 'totalCount': totalCountTemp })
      this.chartData.push(chart)
    }
  }
}
