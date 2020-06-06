import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from 'src/app/api.service';
import { element } from 'protractor';

interface chartSelect {
  selector: number;
  viewValue: string;
}

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

  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Chart 1'},
    {selector: 1, viewValue: 'Chart 2'},
    {selector: 2, viewValue: 'Chart 3'},
    {selector: 3, viewValue: 'Chart 4'}
  ];

  selectedChartIndex: number;
  cachedChartIndex: number;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.currDateStart = new Date(2020, 3, 1);
    this.currDateEnd = new Date(2020, 6, 1);
  }

  userClick() {

    if(this.selectedChartIndex == undefined){
      console.log("No chart selected");
      return;
    }

    console.log(this.currDateStart);
    console.log(this.currDateEnd);
    console.log("Start: " + this.currDateStart.toISOString().slice(0, 10));
    console.log("End: " + this.currDateEnd.toISOString().slice(0, 10));

    console.log(this.selectedChartIndex);

    if(this.selectedChartIndex != this.cachedChartIndex){     //only create new chart if type doesn't match currently displayed one
      this.cachedChartIndex = this.selectedChartIndex;        //update currently displayed chart index
      if(this.chart != undefined)           //destroy chart if don't exist
        this.chart.destroy();
      this.createChart(this.selectedChartIndex);
    }

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
    this.updateChart(); 
  }

  updateChart() {
    if(this.selectedChartIndex == 1)
      return;

    /*TODO make routine dependent on selected chart*/

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

  createChart(chartIndex: number)
  {
    console.log("Chart creation " + chartIndex);
    switch(chartIndex)
    {
      case 0: {
        this.createPreliminaryChart(); 
        break;
      }
      case 1: {
        this.createStackedChartEvents(); 
        break;
      }
      default: {
        console.log("Chart not available");
        break;
      }
    }    
  }

  createStackedChartEvents()
  {
    console.log("Creating stacked events chart");

    /*array of saturation values*/
    let svList:number[][] = [[], [], [], [], [], [], [], []];
    /*array of color values as string*/
    let colorList:string[][] = [[], [], [], [], [], [], [], []];
    /*array for uniform values*/
    let uniformData:number[] = [];


    /*create saturation values*/
    let avalue = 0.5;
    let offset = 0.05;
    let index = 0;
    svList.forEach(element => {
      element.length = this.allDistricts.length;
      element.fill(0);
      element.forEach(value => {
        element[index] = avalue;
        avalue += offset;
        if(avalue > 1 - offset || avalue < -offset)
          offset *= -1;

        index++;
      });

      index = 0;
    });


    /*create rgb value strings*/
    let topIndex = 0;
    let subIndex = 0;
    colorList.forEach(element => {
      index = 0;
      subIndex = 0;

      element.length = this.allDistricts.length;
      element.fill('rgba(256, 256, 256, 1)');
      element.forEach(value => {
        element[index] = 'rgba( ' + 256 * svList[topIndex][subIndex] + ', ' + 256 * svList[topIndex][subIndex] + ', ' + 256 * svList[topIndex][subIndex] + ', 1)';
        subIndex++;
        index++;
      });

      topIndex++;
    });


    /*create uniform data*/
    uniformData.length = this.allDistricts.length;
    uniformData.fill(1);


    /*create chart*/
    var ctx = document.getElementById('canvas');    //get html context
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.allDistricts,
        datasets: [
          { 
            data: uniformData,
            backgroundColor: colorList[0],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[1],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[2],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[3],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[4],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[5],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[6],
            fill: false
          },
          { 
            data: uniformData,
            backgroundColor: colorList[7],
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
            stacked: true,
            display: true
          }],
          yAxes: [{
            ticks: {  //set custom label
              max: 8,
              min: 0,
              stepSize: 0.5,
              callback: function(value, index, values) {
                switch (value) {
                  case 0.5:
                      return 'Bauarbeiten';
                  case 1.5:
                      return 'Baustelle';
                  case 2.5:
                      return 'Fahrstreifensperrung';
                  case 3.5:
                      return 'Gefahr';
                  case 4.5:
                      return 'Sperrung';
                  case 5.5:
                      return 'Stau';
                  case 6.5:
                      return 'Störung';
                  case 7.5:
                      return 'Unfall';
                  default:
                      return null;
                }
              }
            },
            stacked: true
          }],
        }
      }
    });

  }

  createPreliminaryChart()
  {
    console.log("Creating preliminary chart");
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
