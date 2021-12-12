import { DynamicComponentDirective } from './../../directives/dynamic-component.directive';
import { LogDataViewComponent } from './../log-data-view/log-data-view.component';
import { DynamicComponents } from './../../models/dynamic-components';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor() { }
  index = 0;
  dynamicComponetsData: DynamicComponents[] = [];
  currentAdIndex = -1;
  interval: any;

  @ViewChild(DynamicComponentDirective, { static: true }) componentHost!: DynamicComponentDirective;

  ngOnInit(): void {
    this.dynamicComponetsData = [
      new DynamicComponents(
        LogDataViewComponent,
        {
          name: 'worker', columns: [
            {
              columnName: "CreateDateTime"
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
        {
          name: 'crawler', columns: [
            {
              columnName: "CreateDateTime"
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
              columnName: "Page"
            }
          ]
        }
      ),
      new DynamicComponents(
        LogDataViewComponent,
        {
          name: 'processor', columns: [
            {
              columnName: "CreateDateTime"
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
              columnName: "Title"
            }
          ]
        }
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
