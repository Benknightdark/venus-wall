import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor() { }
  index = 0;
  ngOnInit(): void {
  }
  onIndexChange(event: number): void {
    this.index = event;
  }
}
