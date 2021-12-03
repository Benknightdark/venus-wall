import { LogService } from './../../services/log.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzTableComponent } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-log-data-view',
  templateUrl: './log-data-view.component.html',
  styleUrls: ['./log-data-view.component.css']
})
export class LogDataViewComponent implements OnInit, OnDestroy, AfterViewInit {
  $getData!: Subscription;
  constructor(private lgoService: LogService) { }

  @Input() data: any;
  tableData: any[] = [];
  loading: boolean = true;
  currentDataCount: number = 0;
  offset = 0;
  limit = 20;
  stopGetMoreData: boolean = false;
  @ViewChild('basicTable', { static: false }) nzTableComponent?: NzTableComponent<any>;

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.$getData = this.lgoService.getLogData(this.data['name'], this.offset, this.limit).subscribe(logData => {
      if (logData.length > 0) {
        this.tableData = [...this.tableData, ...logData];
        this.currentDataCount = this.tableData.length
      } else {
        this.stopGetMoreData = true;
      }
      this.loading = false;
    });
  }
  trackByIndex(_: number, data: any): number {
    return data.index;
  }
  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.subscribe((scrollIndex: number) => {
      if (this.stopGetMoreData)
        return;
      if (scrollIndex === 0)
        return;
      if (this.loading)
        return;
      const end = this.nzTableComponent?.cdkVirtualScrollViewport?.getRenderedRange().end;
      const total = this.nzTableComponent?.cdkVirtualScrollViewport?.getDataLength();
      console.log(end, total)
      if (end === total) {
        this.offset = this.offset + this.limit;
        this.loading = true;
        this.loadData();
      }
    });
  }
  resetVariable() {
    this.currentDataCount = 0;
    this.offset = 0;
    this.limit = 20;
    this.stopGetMoreData = false;
  }
  ngOnDestroy(): void {
    this.$getData.unsubscribe();
    this.resetVariable();
    console.log('destroy')
  }
}
