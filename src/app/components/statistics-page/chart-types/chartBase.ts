

export class ChartBase {
    public chart:any;

    ctx: HTMLCanvasElement;
    allDistricts: string[];
    allEvents: string[];
    allTimeSteps: number[];

    constructor (ctx: HTMLCanvasElement, allDistricts: string[], allEvents: string[], allTimeSteps: number[])
    {
        this.ctx = ctx;
        this.allDistricts = allDistricts;
        this.allEvents = allEvents;
        this.allTimeSteps = allTimeSteps;
    }

    destroy()
    {
        console.log("Chart destroyed");
        this.chart.destroy();
    }

}