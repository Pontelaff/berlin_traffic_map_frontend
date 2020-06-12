import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


export class ChartBase {
    public chart:any;

    ctx:HTMLCanvasElement;
    allDistricts:string[];
    allEvents:string[];

    constructor (ctx: HTMLCanvasElement, allDistricts: string[], allEvents: string[])
    {
        this.ctx = ctx;
        this.allDistricts = allDistricts;
        this.allEvents = allEvents;
    }

    destroy()
    {
        console.log("Chart destroyed");
        this.chart.destroy();
    }

}