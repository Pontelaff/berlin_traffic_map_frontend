import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'


export class ChartStackedDuration extends ChartStacked {

    update(data: any)
    {
        this.updateRoutine(data, this.allTimeSteps.length);
    }

    create() 
    {  
      /*create options*/
      let timesteps = this.allTimeSteps;
      let options = {
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
              max: timesteps.length,
              min: 0,
              stepSize: 0.5,
              callback: function(value, index, values) {
                if(<number>value - Math.round(<number>value) == 0)
                  return null;

                let label = "";
                index = Math.round(<number>value) - 1;
                if(index == timesteps.length - 1)
                {
                  label = timesteps[index] + "+"
                  return label;
                }

                label += timesteps[index] + " - " + timesteps[index + 1];

                return label;
              }
            },
            stacked: true
          }],
        }
      }
      
     
      /*intialize chart creation*/
      this.createChart(this.relevantEvents.length, options);
    }
}