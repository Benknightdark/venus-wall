import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-data-view',
  templateUrl: './log-data-view.component.html',
  styleUrls: ['./log-data-view.component.css']
})
export class LogDataViewComponent implements OnInit {

  constructor() { }
  @Input() data: any;
  ngOnInit(): void {
  }

}
