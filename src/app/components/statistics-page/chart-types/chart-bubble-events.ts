import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartBase } from './chartBase'
import { cloneDeep } from 'lodash';


interface Bubble {
    x: number,
    y: number,
    r: number
}

export class ChartBubbleEvents extends ChartBase {

    maxBubbleRadius: number = 50;

    occurenceData: any = [];
    durationData: any = [];

    containerSetup()
    {
        this.data = this.initContainer3D(2, this.relevantEvents.length, this.allDistricts.length);
    }

    indicateBusy()
    {
        if(this.durationData.length == 0)
            return;

        let maximum = this.determineMaximum(this.durationData);

        for(let eventIdx = 0; eventIdx < this.relevantEvents.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
                this.setBubbleBackgroundColor(eventIdx, districtIdx, maximum, this.busySaturation);
        }
        
        this.chart.update();
    }

    addData(incomingData: any, districtIdx: number)
    {
        incomingData.forEach(entry => {
        for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
        {
            if(this.allEvents[eventIdx] == entry.consequence.summary)
            {
                /*fill occurence data*/
                let relevantIdx = this.eventsToRelevantMap[eventIdx];
                this.data[0][relevantIdx][districtIdx]++;

                /*fill duration data*/
                let dateFrom = entry.validities[0].timeFrom;
                let dateTo = entry.validities[0].timeTo;
                let diffMinutes = this.calculateTimespanInMinutes(new Date(dateFrom), new Date(dateTo));
                this.data[1][relevantIdx][districtIdx] += diffMinutes;
            }
        }
        });
    }

    determineMaximum(data: any)
    {
        let max = 0;
        data.forEach(element => {
            element.forEach(element => {
                if(element > max)
                max = element;
            });
        });

        return max;
    }

    update()
    {
        this.occurenceData = cloneDeep(this.data[0]);
        let maxOccurences = this.determineMaximum(this.occurenceData);
        if(maxOccurences == 0)
            maxOccurences = 1;

        this.durationData = cloneDeep(this.data[1]);
        let maxDuration = this.determineMaximum(this.durationData);
        if(maxDuration == 0)
            maxDuration = 0.1;

        for(let eventIdx = 0; eventIdx < this.occurenceData.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
            {
                let dataIndex = eventIdx * this.allDistricts.length + districtIdx;

                /* set radii of bubbles relative to maximum occurence count, scaled to maxOccurences and maxBubbleRadius */
                let normalizedRadius = this.maxBubbleRadius * (this.occurenceData[eventIdx][districtIdx] / maxOccurences);
                normalizedRadius = Math.round(normalizedRadius * 10) / 10;
                this.chart.data.datasets[0].data[dataIndex].r = normalizedRadius;
                
                /* set color */
                this.setBubbleBackgroundColor(eventIdx, districtIdx, maxDuration);

                /* set labels for tooltips in absolute numbers */
                this.chart.data.datasets[0].hoverBackgroundColor[dataIndex] = this.occurenceData[eventIdx][districtIdx];
                this.chart.data.datasets[0].hoverBorderColor[dataIndex] = this.durationData[eventIdx][districtIdx];
            }
        }

        this.chart.update();

    }

    /*set background color of bubbles relative to maximum duration count, scaled to maxDuration*/
    setBubbleBackgroundColor(eventIdx: number, districtIdx: number, absoluteMax: number, saturation: number = this.defaultSaturation)
    {
        let dataIndex = eventIdx * this.allDistricts.length + districtIdx;
        let logval =  Math.log(this.durationData[eventIdx][districtIdx]);
        let logMax = Math.log(absoluteMax);
        let ratio = logval / logMax;
        let normalizedLightness = 75 - ratio * 50;          //caps at lightness between 25% and 75% with higher durations being darker
        let colorString = this.getHSLColorString(82, saturation, normalizedLightness)    //htw corporate identity green

        this.chart.data.datasets[0].backgroundColor[dataIndex] = colorString;
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
        colorList.fill(this.getHSLColorString(0, 0, 50));  //fill with gray

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
                            (occurences != undefined) ? description += occurences : description += "[ERROR]";

                            multiLineReturn[0] = description;
                            description = "Dauer insgesamt: "

                            let duration = data.datasets[tooltipItem.datasetIndex].hoverBorderColor[tooltipItem.index];

                            /* don't include duration if there is no time available */
                            if(duration == 0)
                                return multiLineReturn;

                            if(duration != undefined)
                            {
                                function createString(count: number, descriptor: string)
                                {
                                    let str = count + " " + descriptor + ", ";
                                    return str;
                                }

                                /* convert to years, days, hours, minutes */
                                /* allows for e.g. "2 Jahre, 0 Tage, 5 Stunden, 11 Minuten" and "5 Stunden, 11 Minuten" as tooltip text */
                                /* basically serves to include values equal to 0 only if the respective unit is not the most significant needed for describing the duration */
                                let years = Math.floor(duration / (60 * 24 * 365));
                                if(years != 0)                                                                          //only keep string when years are nonzero 
                                    description += createString(years, ((years == 1) ? "Jahr" : "Jahre"));
                                
                                let days = Math.floor(duration / (60 * 24) % 365);
                                if(years + days != 0)                                                                   //only keep string when days are nonzero or years are nonzero 
                                    description += createString(days, ((days == 1) ? "Tag" : "Tage"));
                                
                                let hours = Math.floor(duration / 60) % 24;
                                if(years + days + hours != 0)                                                           //same concept as above
                                    description += createString(hours, ((hours == 1) ? "Stunde" : "Stunden"));
                                
                                let minutes = duration % 60;
                                description += createString(minutes, ((minutes == 1) ? "Minute" : "Minuten"));
                                
                                description = description.slice(0, description.length - 2);                             //cut off trailing ", " characters 
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
                        scaleLabel: {
                            labelString: "Bezirke",
                            display: true,
                            fontStyle: "bold",
                            fontSize: 14
                        },
                        ticks:{     //set custom label
                            max: 12,
                            min: 0,
                            fontStyle: "bold",
                            fontSize: 14,
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
                    scaleLabel: {
                        labelString: "Störungsarten",
                        display: true,
                        fontStyle: "bold",
                        fontSize: 14
                    },
                    ticks: {  //set custom label
                      max: 5,
                      min: 0,
                      fontStyle: "bold",
                      fontSize: 14,
                      stepSize: 0.5,
                      callback: function(value, index, values) {
                        if(<number>value - Math.round(<number>value) == 0)
                            return null;
                        else
                            return events[Math.round(<number>value) - 1];
                      }
                    },
                  }],
                }
            }

        });
    }

}