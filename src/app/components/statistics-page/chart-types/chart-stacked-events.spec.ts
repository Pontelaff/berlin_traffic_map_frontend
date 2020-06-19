import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartStackedEvents } from './chart-stacked-events';

describe('ChartStackedEvents', () => {
  let subject: ChartStackedEvents;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartStackedEvents("canvas", allDistricts, allEvents, allTimeSteps);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets.length).toEqual(subject.relevantEvents.length);
  });

  it('should create container', () => {
    expect(subject.data.length).toEqual(subject.relevantEvents.length);
  });

  it('should show y axis labels', () => {
    subject.create();

    let label:string;

    /* test whole number label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(1, 0, 0);
    expect(label).toEqual(null);

    /* test offset label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(0.5, 0, 0);
    expect(label).toEqual(subject.relevantEvents[0]);
  });

  it('should show label', () => {
    subject.create();

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    let label:string;
    let color:string;
    let context: any;

    context = {dataset: subject.chart.data.datasets[0], dataIndex: 0};
    label = subject.chart.options.plugins.datalabels.formatter(0, context);
    color = subject.chart.options.plugins.datalabels.color(context);
    expect(label).toEqual("0%");
    expect(color).toEqual("hsl(45, 100%, 50%)");
  });

  it('should update chart', () => {
    subject.create();

    let testAmount = 100;
    let testEvent:string = subject.relevantEvents[0];

    let data = [];
    data.length = testAmount;
    data.fill({
      consequence: {
        summary: testEvent
      }
    });
    
    subject.addData(data, 0);
    expect(subject.data[0][0]).toEqual(testAmount);

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    subject.indicateBusy();
    subject.update();

    expect(chartSpy.update).toHaveBeenCalled();
  });
});