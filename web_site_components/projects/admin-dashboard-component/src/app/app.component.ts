import { Component, Input, OnChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  templateUrl: './app.component.html',
  styles: [`
  .main-container {
    padding: 30px;
  }


  .heading {
    text-align: center;
  }

  .heading__title {
    font-weight: 600;
  }


  .heading__link {
    text-decoration: none;
  }

  .heading__credits .heading__link {
    color: inherit;
  }


  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .card {
    margin: 20px;
    padding: 10px;
    width: 200px;
    min-height: 100x;
    display: grid;
    grid-template-rows: 10px 20px 1fr 10px;
    border-radius: 10px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.2s;
  }

  .card:hover {
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
    transform: scale(1.01);
  }

  .card__link,
  .card__exit,
  .card__icon {
    position: relative;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.9);
  }

  .card__link::after {
    position: absolute;
    top: 25px;
    left: 0;
    content: "";
    width: 0%;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.6);
    transition: all 0.5s;
  }

  .card__link:hover::after {
    width: 100%;
  }

  .card__exit {
    grid-row: 1/2;
    justify-self: end;
  }

  .card__icon {
    grid-row: 2/3;
    font-size: 30px;
  }

  .card__title {
    grid-row: 3/4;
    font-weight: 400;
    color: #ffffff;
  }

  .card__apply {
    grid-row: 4/5;
    align-self: center;
  }


  .card-1 {
    background: radial-gradient(#1fe4f5, #3fbafe);
  }

  .card-2 {
    background: radial-gradient(#fbc1cc, #fa99b2);
  }

  .card-3 {
    background: radial-gradient(#76b2fe, #b69efe);
  }

  .card-4 {
    background: radial-gradient(#60efbc, #58d5c9);
  }

  .card-5 {
    background: radial-gradient(#f588d8, #c0a3e5);
  }


  @media (max-width: 1600px) {
    .cards {
      justify-content: center;
    }
  }`]

})
export class AppComponent implements OnChanges {
  @Input() adminDataSource: any[] = []
  @Input() taskCountDataSource: any[] = []
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
          text: `【${item.forumName!}】論壇文章數量長條圖`
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
