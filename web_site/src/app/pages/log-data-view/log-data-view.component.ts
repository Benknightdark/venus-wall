import { LogService } from './../../services/log.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-log-data-view',
  templateUrl: './log-data-view.component.html',
  styleUrls: ['./log-data-view.component.css']
})
export class LogDataViewComponent implements OnInit {
  $getData!: Subscription;
  constructor(private lgoService: LogService) { }
  @Input() data: any;
  tableData:any;
  ngOnInit(): void {
    this.$getData = this.lgoService.getLogData(this.data['name']).subscribe(a => {
      this.tableData=a;
    });
  }
  OnDestroy(): void {
    this.$getData.unsubscribe();
  }
}
