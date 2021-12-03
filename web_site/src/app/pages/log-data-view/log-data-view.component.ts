import { LogService } from './../../services/log.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzTableComponent } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-log-data-view',
  templateUrl: './log-data-view.component.html',
  styleUrls: ['./log-data-view.component.css']
})
export class LogDataViewComponent implements OnInit, AfterViewInit {
  $getData!: Subscription;
  constructor(private lgoService: LogService) { }
  @Input() data: any;
  tableData: any[]=[];
  loading: boolean = true;
  currentDataCount:number=0;
  offset=0;
  limit=20
  @ViewChild('basicTable', { static: false }) nzTableComponent?: NzTableComponent<any>;

  ngOnInit(): void {
this.loadData();
  }
  loadData(){
    this.$getData = this.lgoService.getLogData(this.data['name'],this.offset,this.limit).subscribe(logData => {
      this.tableData =[...this.tableData,...logData];
      this.currentDataCount=this.tableData.length-1
      this.loading = false;
    });
  }
  trackByIndex(_: number, data: any): number {
    return data.index;
  }
  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.subscribe((scrolledIndex: number) => {
      if(scrolledIndex===this.currentDataCount){
        console.log("Got YOU")
        this.offset=  this.offset+this.limit;
        this.loading=true;
        this.loadData();
      }
    });
  }
  nextBatch(index: any) {
    console.log(index)
  }
  OnDestroy(): void {
    this.$getData.unsubscribe();
  }
}
