import * as Chart from 'chart.js';
import { ChartBase } from './chartBase'
import { cloneDeep } from 'lodash';



export class ChartStacked extends ChartBase {


    updateRoutine(data: any, containerSize: number)
    {
        /*get total amount of occurences per district*/
        let totalPerDistrict = this.getTotalsPerDistrict(data);

        /*convert absolutes to relatives*/    
        let chartData = this.convertToRelatives(data, totalPerDistrict, containerSize);

        /*create hsl value strings*/
        let colorList:string[][] = this.createColorStrings(chartData);

        /*update Chart*/ 
        this.updateChart(chartData, colorList);
    }

    getTotalsPerDistrict(data: any)
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
        return totalPerDistrict;
    }

    convertToRelatives(baseData: any, totalsPerDistrict: any, arrayCount: number)
    {
        /*create deep copy without references*/
        let chartData = cloneDeep(baseData);

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

    createColorStrings(chartData: any, )
    {
        /*create hsl value strings*/
        let colorList: string[][] = [[]];
        colorList.length = chartData.length;            //resize to either event array size or timestep array size

        for(let timeStepIdx = 0; timeStepIdx < colorList.length; timeStepIdx++)      //iterate through timeStep-level
        {
            colorList[timeStepIdx] = [];            //initialize sub array
            let element = colorList[timeStepIdx];
            element.length = this.allDistricts.length;
            element.fill('hsl(0, 0%, 50%)');  //fill with gray
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

}
