import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'

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
        this.determineMaximum(data);

        for(let eventIdx = 0; eventIdx < data.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
            {
                let dataIndex = eventIdx * this.allDistricts.length + districtIdx;

                /*set radii of bubbles relative to maximum value, scaled to maxOccurences and maxBubbleRadius*/
                let normalizedRadius = this.maxBubbleRadius * (data[eventIdx][districtIdx] / this.maxOccurences);
                normalizedRadius = Math.round(normalizedRadius * 10) / 10;
                this.chart.data.datasets[0].data[dataIndex].r = normalizedRadius;

                /*set labels for tooltips in absolute numbers*/
                this.chart.data.datasets[0].hoverBackgroundColor[dataIndex] = data[eventIdx][districtIdx];
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

        this.chart = new Chart(this.ctx, {
            plugins: [ChartDataLabels],
            type: 'bubble',
            data: {
                labels: this.allDistricts,
                datasets: [
                    {
                        data: this.generateData(),
                        hoverBackgroundColor: []      //using hoverBackgroundColor as label container since labels stopped working 
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
                    callbacks: {
                        label: function(tooltipItem, data) {
                            // let eventIndex = Math.floor(tooltipItem.index / districts.length);
                            // let districtIndex = tooltipItem.index % districts.length;
                            // let description = "Aufkommen von " + events[eventIndex] + " in " + districts[districtIndex] + ": ";

                            // let bubble = <Bubble>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            // let val = bubble.r;

                            // description += val;
                            // return description;

                            let eventIndex = Math.floor(tooltipItem.index / districts.length);
                            let districtIndex = tooltipItem.index % districts.length;
                            let description = "Aufkommen von " + events[eventIndex] + " in " + districts[districtIndex] + ": ";

                            let occurences = data.datasets[tooltipItem.datasetIndex].hoverBackgroundColor[tooltipItem.index];
                            if(occurences != undefined)
                                description += occurences;

                            return description;
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