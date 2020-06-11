import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'
import { stringify } from 'querystring';


export class ChartRadarEvents extends ChartBase {

    update(data: any)
    {
        let chartData = cloneDeep(data);

        for(let eventIdx = 1; eventIdx < chartData.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
            {
                chartData[eventIdx][districtIdx] += chartData[eventIdx - 1][districtIdx];
            }
        }

        for(let idx = 0; idx < chartData.length; idx++)
        {
            let element = chartData[idx];
            this.chart.data.datasets[idx].data = element;
        }

        this.chart.update();
    }

    create()
    {
        let uniformData = [[], [], [], [], [], [], [], []];
        for(let idx = 0; idx < this.allEvents.length; idx++)
        {
            uniformData[idx].length = this.allDistricts.length;
            uniformData[idx].fill(idx + 1);
        }

        this.chart = new Chart(this.ctx, {
            type: 'radar',
            data: {
                labels: this.allDistricts,
                datasets: [
                  { 
                    data: uniformData[0],
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    label: this.allEvents[0],
                  },
                  { 
                    data: uniformData[1],
                    backgroundColor: 'rgba(256, 0, 0, 1)',
                    label: this.allEvents[1],
                  },
                  { 
                    data: uniformData[2],
                    backgroundColor: 'rgba(0, 256, 0, 1)',
                    label: this.allEvents[2],
                  },
                  { 
                    data: uniformData[3],
                    backgroundColor: 'rgba(0, 0, 256, 1)',
                    label: this.allEvents[3],
                  },
                  { 
                    data: uniformData[4],
                    backgroundColor: 'rgba(256, 256, 0, 1)',
                    label: this.allEvents[4],
                  },
                  { 
                    data: uniformData[5],
                    backgroundColor: 'rgba(0, 256, 256, 1)',
                    label: this.allEvents[5],
                  },
                  { 
                    data: uniformData[6],
                    backgroundColor: 'rgba(256, 0, 256, 1)',
                    label: this.allEvents[6],
                  },
                  { 
                    data: uniformData[7],
                    backgroundColor: 'rgba(256, 256, 256, 1)',
                    label: this.allEvents[7],
                  }
                ]
              },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: true
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem, data) {

                            let string = <string>data.datasets[tooltipItem.datasetIndex].label + ": ";

                            let val = <number>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                            if(tooltipItem.datasetIndex > 0)
                                val = val - <number>data.datasets[tooltipItem.datasetIndex - 1].data[tooltipItem.index]

                            string += val;

                            return string;
                        }
                    }
                },
                scale: {
                    ticks: {
                        suggestedMin: 0
                    }
                }
              }
        })
    }

}