import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'
import { duration } from 'moment';

interface Bubble {
    x: number,
    y: number,
    r: number
}

export class ChartBubbleEvents extends ChartBase {

    maxOccurences: number = 0;
    maxBubbleRadius: number = 50;

    determineMaximum(data: any)
    {
        data.forEach(element => {
            element.forEach(element => {
                if(element > this.maxOccurences)
                    this.maxOccurences = element;
            });
        });
    }

    update(data: any)
    {
        let occurenceData = data[0];
        let durationData = data[1];
        this.determineMaximum(occurenceData);

        console.log(occurenceData);
        console.log(durationData);

        for(let eventIdx = 0; eventIdx < occurenceData.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
            {
                let dataIndex = eventIdx * this.allDistricts.length + districtIdx;

                /*set radii of bubbles relative to maximum value, scaled to maxOccurences and maxBubbleRadius*/
                let normalizedRadius = this.maxBubbleRadius * (occurenceData[eventIdx][districtIdx] / this.maxOccurences);
                normalizedRadius = Math.round(normalizedRadius * 10) / 10;
                this.chart.data.datasets[0].data[dataIndex].r = normalizedRadius;

                /*set labels for tooltips in absolute numbers*/
                this.chart.data.datasets[0].hoverBackgroundColor[dataIndex] = occurenceData[eventIdx][districtIdx];

                this.chart.data.datasets[0].hoverBorderColor[dataIndex] = durationData[eventIdx][districtIdx];
            }
        }

        this.chart.update();

    }

    generateData()
    {
        let data = [];

        for(let y = 0.5; y < this.relevantEvents.length; y++)
        {
            for(let x = 0.5; x < this.allDistricts.length; x ++)
            {
                data.push({
                    x: x,
                    y: y,
                    r: this.maxBubbleRadius / 2,
                })
            }
        }
        return data;
    }

    create()
    {
        let districts = this.allDistricts;
        let events = this.relevantEvents;

        let colorList: string[] = [];
        colorList.length = this.allDistricts.length * this.relevantEvents.length;
        colorList.fill('hsl(0, 0%, 50%)');  //fill with gray

        this.chart = new Chart(this.ctx, {
            plugins: [ChartDataLabels],
            type: 'bubble',
            data: {
                labels: this.allDistricts,
                datasets: [
                    {
                        data: this.generateData(),
                        backgroundColor: colorList,
                        hoverBackgroundColor: [],      //actually storing absolute occurence counts, using hoverBackgroundColor as tooltip data container since labels stopped working 
                        hoverBorderColor: []      //actually storing absolute total duration, same as hoverBackgroundColor
                    }
                ],
                    
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: false
                },
                hover: {
                  mode: null
                },
                elements: {
                    point: {
                        backgroundColor: "rgba(120, 256, 32, 0.6)"
                    }
                },
                tooltips: {
                    enabled: true,
                    displayColors: false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let multiLineReturn = [""];

                            let eventIndex = Math.floor(tooltipItem.index / districts.length);
                            let districtIndex = tooltipItem.index % districts.length;
                            let description = "Aufkommen von " + events[eventIndex] + " in " + districts[districtIndex] + ": ";

                            let occurences = data.datasets[tooltipItem.datasetIndex].hoverBackgroundColor[tooltipItem.index];
                            if(occurences != undefined)
                                description += occurences;

                            multiLineReturn[0] = description;
                            description = "";

                            description = "Dauer insgesamt: "

                            let duration = data.datasets[tooltipItem.datasetIndex].hoverBorderColor[tooltipItem.index];
                            if(duration != undefined)
                            {
                                /*convert to days, hours, minutes */
                                let minutes = duration % 60;
                                let hours = Math.floor(duration / 60) % 24;
                                let days = Math.floor(duration / (60 * 24));
                                description += days + " Tage, " + hours + " Stunden, " + minutes + " Minuten";
                            }

                            multiLineReturn.push(description);

                            return multiLineReturn;
                        }
                    }
                },
                plugins: {
                  datalabels: {
                    display: false,
                  }
                },
                scales: {
                    xAxes: [{
                        ticks:{     //set custom label
                            max: 12,
                            min: 0,
                            stepSize: 0.5,
                            callback: function(value, index, values) {
                                if(<number>value - Math.round(<number>value) == 0)
                                    return null;
                                else
                                    return districts[Math.round(<number>value) - 1];
                            }
                        }
                    }],
                  yAxes: [{
                    ticks: {  //set custom label
                      max: 5,
                      min: 0,
                      stepSize: 0.5,
                      callback: function(value, index, values) {
                        if(<number>value - Math.round(<number>value) == 0)
                            return null;
                        else
                            return events[Math.round(<number>value) - 1];
                      }
                    }
                  }],
                }
            }

        });
    }

}