import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  minDate = new Date(2020, 4, 10);     //first relevant date in the past
  maxDate = new Date(2020, 8, 10);     //last relevant date in the future

  currDateStart = new Date();
  currDateEnd = new Date();

  constructor() { }

  ngOnInit(): void {
  }

  logDates() {
    console.log(this.currDateStart);
    console.log(this.currDateEnd);
  }

}
