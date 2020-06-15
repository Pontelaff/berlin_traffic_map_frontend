import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartBase } from './chartBase'
import { cloneDeep } from 'lodash';



export class ChartStacked extends ChartBase {

    options: any;

    updateRoutine(containerSize: number)
    {
        /*get total amount of occurences per district*/
        let totalPerDistrict = this.getTotalsPerDistrict();

        /*convert absolutes to relatives*/    
        let chartData = this.convertToRelatives(totalPerDistrict, containerSize);

        /*create hsl value strings*/
        let colorList:string[][] = this.createColorStrings(chartData);

        /*update Chart*/ 
        this.updateChart(chartData, colorList);
    }

    getTotalsPerDistrict()
    {
        /*get total amount of occurences per district*/
        let totalPerDistrict = [];
        totalPerDistrict.length = this.allDistricts.length;
        totalPerDistrict.fill(0);
        for(let idx = 0; idx < totalPerDistrict.length; idx++)
        {
            this.data.forEach(element => {
            totalPerDistrict[idx] += element[idx];
            });
        }
        return totalPerDistrict;
    }

    convertToRelatives(totalsPerDistrict: any, arrayCount: number)
    {
        /*create deep copy without references*/
        let chartData = cloneDeep(this.data);

        /*convert absolutes to relatives*/    
        for(let arrayIdx = 0; arrayIdx < arrayCount; arrayIdx++)
        {
            for(let districtIdx = 0; districtIdx < totalsPerDistrict.length; districtIdx++)
            {
              if(totalsPerDistrict[districtIdx] != 0)
                chartData[arrayIdx][districtIdx] /= totalsPerDistrict[districtIdx];          
            }
        }

        return chartData;
    }

    createColorStrings(chartData: any)
    {
        /*create hsl value strings*/
         let colorList: string[][] = [[]];
         colorList.length = chartData.length;            //resize to either event array size or timestep array size

        for(let timeStepIdx = 0; timeStepIdx < colorList.length; timeStepIdx++)      //iterate through timeStep-level
        {
            colorList[timeStepIdx] = this.initializeColorSubArray(this.allDistricts.length);
            let element = colorList[timeStepIdx];
            for(let districtIdx = 0; districtIdx < element.length; districtIdx++)    //iterate through district-level
            {
                let hue = (districtIdx) / this.allDistricts.length * 360 + 15; //offset by 15 to avoid unreadable yellow
                let lightness = 100 - chartData[timeStepIdx][districtIdx] * 50;    //lightness 50 = 100%, lightness 100 = 0%
                let string = 'hsl(' + hue + ', 100%,' + lightness + '%)';
                element[districtIdx] = string;     //apply color and lightness
            }
        }

         return colorList;
    }

    initializeColorSubArray(length: number)
    {
        let array = [];            //initialize sub array
        array.length = length;
        array.fill('hsl(0, 0%, 50%)');  //fill with gray
        return array;
    }

    updateChart(chartData:any, colorList: any)
    {
        for(let idx = 0; idx < colorList.length; idx++)
        {
            let element = colorList[idx];
            this.chart.data.datasets[idx].backgroundColor = element;
        }
  
        for(let idx = 0; idx < chartData.length; idx++)
        {
            this.chart.data.datasets[idx].hoverBackgroundColor = chartData[idx];
        }
  
        this.chart.update();
    }

    createDefaultOptions()
    {
        this.options = {
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
                  let datasetSize = context.dataset.data.length;
                  let hue = (context.dataIndex + 1) / datasetSize * 360 + 15; //offset by 15 to avoid unreadable yellow
                  let lightness = 50 - context.dataset.hoverBackgroundColor[context.dataIndex] * 50;    //lightness 0 = 100%, lightness 50 = 0%
                  let string = 'hsl(' + hue + ', 100%,' + lightness + '%)';
                  return string;
                },
                formatter: function(value, context) {
                  return Math.round(context.dataset.hoverBackgroundColor[context.dataIndex] * 100 * 10) / 10 + "%";    //convert to percentage, round to first decimal place and append % character 
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
              yAxes: [],
            }
          }
    }

    createChart(datasetCount: number)
    {
        /*create default rgb value strings*/
        let colorList:string[][] = [[]];
        colorList.length = datasetCount;

        for(let eventIdx = 0; eventIdx < colorList.length; eventIdx++)    //iterate through event-level
        {
            colorList[eventIdx] = this.initializeColorSubArray(this.allDistricts.length);
        }
    
        /*create uniform data*/
        let uniformData: number[] = [];
        uniformData.length = this.allDistricts.length;
        uniformData.fill(1);
        
        let uniformLabels: string[] = [];
        uniformLabels.length = this.allDistricts.length;
        uniformLabels.fill("0");

        /*create empty datasets*/
        let allData = [];
        for(let datasetIdx = 0; datasetIdx < datasetCount ;datasetIdx++)
        {
            allData.push({
                data: uniformData,
                backgroundColor: colorList[datasetIdx],
                hoverBackgroundColor: uniformLabels      //using hoverBackgroundColor as label container since labels stopped working 
            })
        }

        /*create chart*/
        this.chart = new Chart(this.ctx, {
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
              labels: this.allDistricts,
              datasets: allData
            },
            options: this.options
          });
    }

}
