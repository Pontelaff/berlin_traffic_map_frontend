import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartBase } from './chartBase'
import { cloneDeep } from 'lodash';



export class ChartStacked extends ChartBase {

    options: any;
    chartData: any = [];

    updateRoutine(containerSize: number)
    {
      /*get total amount of occurences per district*/
      let totalPerDistrict = this.getTotalsPerDistrict();

      /*convert absolutes to relatives*/    
      this.chartData = this.convertToRelatives(totalPerDistrict, containerSize);

      /*create hsl value strings*/
      let colorList:string[][] = this.createColorStrings(this.chartData);

      /*update Chart*/ 
      this.updateChart(this.chartData, colorList);
    }

    indicateBusy()
    {
      if(this.chartData.length == 0 )
        return;
        
      let busyColors:string[][] = this.createColorStrings(this.chartData, 0.25);

      this.updateChart([], busyColors);
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

    createColorStrings(chartData: any, saturation: number = 1)
    {
      /*create hsl value strings*/
      let colorList:string[][] = this.getUniformArray2D(chartData.length, this.allDistricts.length, "hsl(0, 0%, 50%)");

      for(let timeStepIdx = 0; timeStepIdx < colorList.length; timeStepIdx++)      //iterate through timeStep-level
      {
          let element = colorList[timeStepIdx];
          for(let districtIdx = 0; districtIdx < element.length; districtIdx++)    //iterate through district-level
          {
              let hue = (districtIdx) / this.allDistricts.length * 360 + 15; //offset by 15 to avoid unreadable yellow
              let lightness = 100 - chartData[timeStepIdx][districtIdx] * 50;    //lightness 50 = 100%, lightness 100 = 0%
              let string = 'hsl(' + hue + ', ' + saturation * 100 + '%,' + lightness + '%)';
              element[districtIdx] = string;     //apply color and lightness
          }
      }

        return colorList;
    }

    getUniformArray2D(mainLength: number, subLength: number, value: any)
    {
      let arr: any[][] = [[]];
      arr.length = mainLength;

      for(let mainIdx = 0; mainIdx < arr.length; mainIdx++)
      arr[mainIdx] = this.getUniformArray1D(subLength, value);

      return arr;
    }

    getUniformArray1D(length: number, value: any)
    {
      let arr = [];
      arr.length = length;
      arr.fill(value);
      return arr;
    }

    updateChart(chartData:any, colorList: any)
    {
      this.updateColors(colorList);
      this.updateLabels(chartData);

      this.chart.update();
    }

    updateColors(colorList: any)
    {
      for(let idx = 0; idx < colorList.length; idx++)
          this.chart.data.datasets[idx].backgroundColor = colorList[idx];
    }

    updateLabels(chartData: any)
    {
      for(let idx = 0; idx < chartData.length; idx++)
          this.chart.data.datasets[idx].hoverBackgroundColor = chartData[idx];
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
                let val = context.dataset.hoverBackgroundColor[context.dataIndex];
                  return Math.round(val * 100 * 10) / 10 + "%";    //convert to percentage, round to first decimal place and append % character                 
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
      /*create default hsl value strings*/
      let colorList:string[][] = this.getUniformArray2D(datasetCount, this.allDistricts.length, "hsl(0, 0%, 50%)");
  
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
