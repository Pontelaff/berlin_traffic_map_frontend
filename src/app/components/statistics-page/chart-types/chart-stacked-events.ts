import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'


export class ChartStackedEvents extends ChartBase{

    update(data:any)
    {
        /*get total amount of occurences per district*/
        let totalPerDistrict = [];
        totalPerDistrict.length = this.allDistricts.length;
        totalPerDistrict.fill(0);
        for(let idx = 0; idx < totalPerDistrict.length; idx++)
        {
            data.forEach(element => {
            totalPerDistrict[idx] += element[idx];
            });
        }

        console.log(totalPerDistrict);

        /*create deep copy without references*/
        let chartData = cloneDeep(data);

        /*convert absolutes to relatives*/    
        for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < totalPerDistrict.length; districtIdx++)
            {
            if(totalPerDistrict[districtIdx] != 0)
                chartData[eventIdx][districtIdx] /= totalPerDistrict[districtIdx];          
            }
        }

        console.log(chartData);

        /*create rgb value strings*/
        let colorList:string[][] = [[], [], [], [], [], [], [], []];

        for(let eventIdx = 0; eventIdx < colorList.length; eventIdx++)      //iterate through event-level
        {
            let element = colorList[eventIdx];
            element.length = this.allDistricts.length;
            element.fill('hsl(0, 0%, 50%)');  //fill with gray
            for(let districtIdx = 0; districtIdx < element.length; districtIdx++)    //iterate through district-level
            {
            let hue = (districtIdx + 1) / this.allDistricts.length * 360 + 15; //offset by 15 to avoid unreadable yellow
            let lightness = 100 - chartData[eventIdx][districtIdx] * 50;    //lightness 50 = 100%, lightness 100 = 0%
            let string = 'hsl(' + hue + ', 100%,' + lightness + '%)';
            element[districtIdx] = string;     //apply color and lightness
            }
        }

        /*update Chart*/   
        for(let iter = 0; iter < colorList.length; iter++)
        {
            let element = colorList[iter];
            this.chart.data.datasets[iter].backgroundColor = element;
        }

        for(let idx = 0; idx < chartData.length; idx++)
        {
            //this.chart.data.datasets[idx].labels = chartData[idx];
            this.chart.data.datasets[idx].hoverBackgroundColor = chartData[idx];
        }

        this.chart.update();
    }

    create() 
    {  
        /*create default rgb value strings*/
        let colorList:string[][] = [[], [], [], [], [], [], [], []];
        for(let eventIdx = 0; eventIdx < colorList.length; eventIdx++)    //iterate through event-level
        {
          let element = colorList[eventIdx];
          element.length = this.allDistricts.length;
          element.fill('hsl(0, 0%, 50%)');  //fill with gray
        }
    
        /*create uniform data*/
        let uniformData:number[] = [];
        uniformData.length = this.allDistricts.length;
        uniformData.fill(1);
    
        /*create chart*/
        let events = this.allEvents;

        this.chart = new Chart(this.ctx, {
          plugins: [ChartDataLabels],
          type: 'bar',
          data: {
            labels: this.allDistricts,
            datasets: [
              { 
                data: uniformData,
                backgroundColor: colorList[0],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']      //using hoverBackgroundColor as label container since labels stopped working 
              },
              { 
                data: uniformData,
                backgroundColor: colorList[1],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[2],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[3],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[4],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[5],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[6],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              },
              { 
                data: uniformData,
                backgroundColor: colorList[7],
                hoverBackgroundColor: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            tooltips: {
              enabled: false
            },
            hover: {
              mode: null
            },
            plugins: {
              datalabels: {
                color: function(context) {
                  let hue = (context.dataIndex + 1) / 12 * 360 + 15; //12 being this.allDistricts.length, offset by 15 to avoid unreadable yellow
                  let lightness = 50 - context.dataset.hoverBackgroundColor[context.dataIndex] * 50;    //lightness 0 = 100%, lightness 50 = 0%
                  let string = 'hsl(' + hue + ', 100%,' + lightness + '%)';
                  return string;
                  return "#000000";
                },
                formatter: function(value, context) {
                  return Math.round(context.dataset.hoverBackgroundColor[context.dataIndex] * 100 * 10) / 10 + "%";    //convert to percentage, round to first decimal place and append % sign 
                },
                align: 'center',
                anchor: 'center'
              }
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
                    if(<number>value - Math.round(<number>value) == 0)
                      return null;
                      else
                        return events[Math.round(<number>value) - 1];
                  }
                },
                stacked: true
              }],
            }
          }
        });
    }
}

