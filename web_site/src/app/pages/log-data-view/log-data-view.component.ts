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
  tableData: any;
  loading: boolean = true;
  @ViewChild('basicTable', { static: false }) nzTableComponent?: NzTableComponent<any>;

  ngOnInit(): void {
    this.$getData = this.lgoService.getLogData(this.data['name']).subscribe(a => {
      console.log(a)
      this.tableData = a;
      this.loading = false;
    });
  }
  trackByIndex(_: number, data: any): number {
    return data.index;
  }
  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange.subscribe((data: number) => {
      console.log('scroll index to', data);
    });
  }
  nextBatch(index: any) {
    console.log(index)
  }
  OnDestroy(): void {
    this.$getData.unsubscribe();
  }
}
