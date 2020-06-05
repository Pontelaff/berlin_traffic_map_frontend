import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  minDate = new Date(2016, 4, 10);     //should be first relevant date in the past, TODO Query
  maxDate = new Date(2024, 8, 10);     //should be last relevant date in the future, TODO Query

  trafficData = [];

  currDateStart = new Date();
  currDateEnd = new Date();

  allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                          "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Stau", "Störung", "Unfall"];

  totalOccurences: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  chart: any;
  chartCreated: boolean;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.currDateStart = new Date(2020, 3, 1);
    this.currDateEnd = new Date(2020, 6, 1);

    this.chartCreated = false;
  }

  userClick() {
    console.log(this.currDateStart);
    console.log(this.currDateEnd);
    console.log("Start: " + this.currDateStart.toISOString().slice(0, 10));
    console.log("End: " + this.currDateEnd.toISOString().slice(0, 10));

    this.makeData();
  }

  makeData()
  {
    let startString = this.currDateStart.toISOString().slice(0, 10);
    let endString = this.currDateEnd.toISOString().slice(0, 10);

    this.apiService.fetchFromTo(startString, endString).subscribe((data:any[])=>{ 
      this.trafficData = data;
      this.chartUpdateRoutine();    
    });

  }

  chartUpdateRoutine() {
    console.log("Data Length " + this.trafficData.length);

    if(!this.chartCreated){
      this.createChart();
      this.chartCreated = true;
    }

    this.updateChart(); 
  }

  updateChart() {
    this.totalOccurences.fill(0);     //reset occurences
    
    let index = 0;
    this.trafficData.forEach(entry => {   //get occurences per event type
      this.allEvents.forEach(event => {
        if(event == entry.consequence.summary){
          this.totalOccurences[index]++;
        }
        else {
          index++;
        }
      });
      index = 0;
    });

    this.chart.update();
  }

  createChart()
  {
    var ctx = document.getElementById('canvas');    //get html context
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.allEvents,
        datasets: [
          { 
            data: this.totalOccurences,
            backgroundColor: 'rgba(0, 0, 0, 0.5',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
