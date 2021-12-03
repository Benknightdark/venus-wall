import { DynamicComponentDirective } from './../../directives/dynamic-component.directive';
import { LogDataViewComponent } from './../log-data-view/log-data-view.component';
import { DynamicComponents } from './../../models/dynamic-components';
import { LogService } from './../../services/log.service';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(private logService: LogService) { }
  index = 0;
  dynamicComponetsData: DynamicComponents[] = [];
  currentAdIndex = -1;
  interval: any;

  @ViewChild(DynamicComponentDirective, { static: true }) componentHost!: DynamicComponentDirective;

  ngOnInit(): void {
    // this.logService.getCrawlerLog(0,10).subscribe(r=>{
    //   console.log(r)
    // })
    // this.logService.getWorkerLog(0,10).subscribe(r=>{
    //   console.log(r)
    // })
    // this.logService.getProcessorLog(0,10).subscribe(r=>{
    //   console.log(r)
    // })
    this.dynamicComponetsData = [
      new DynamicComponents(
        LogDataViewComponent,
        {
          name: 'worker', columns: [
            {
              columnName:"CreateDateTime"
            },
            {
              columnName: "ForumName"
            },
            {
              columnName: "WebPageName"
            },
            {
              columnName: "Topic"
            },
            {
              columnName: "Start"
            },
            {
              columnName: "End"
            }
          ]
        }
      ),
      new DynamicComponents(
        LogDataViewComponent,
        { name: 'crawler', columns: [] }
      ),
      new DynamicComponents(
        LogDataViewComponent,
        { name: 'processor', columns: [] }
      )
    ];
    this.loadComponent();

  }


  loadComponent() {
    this.currentAdIndex = (this.currentAdIndex + 1) % this.dynamicComponetsData.length;
    const adItem = this.dynamicComponetsData[this.currentAdIndex];
    const viewContainerRef = this.componentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<DynamicComponents>(adItem.component);
    componentRef.instance.data = adItem.data;
  }


  onIndexChange(event: number): void {
    this.index = event;
    this.currentAdIndex = this.index - 1;
    this.loadComponent();
  }
}
