import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartStackedDuration } from './chart-stacked-duration';

describe('ChartStackedDuration', () => {
  let subject: ChartStackedDuration;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartStackedDuration("canvas", allDistricts, allEvents, allTimeSteps);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets.length).toEqual(allTimeSteps.length);
  });

  it('should create container', () => {
    expect(subject.data.length).toEqual(allTimeSteps.length);
  });

  it('should show y axis labels', () => {
    subject.create();

    let label:string;

    /* test whole number label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(1, 0, 0);
    expect(label).toEqual(null);

    /* test offset label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(0.5, 0, 0);
    expect(label).toEqual(allTimeSteps[0] + " - " + allTimeSteps[1]);

    /* test max label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(allTimeSteps.length - 1 + 0.5, 0, 0);
    expect(label).toEqual(allTimeSteps[allTimeSteps.length - 1] + "+");
  });

  it('should update chart', () => {
    subject.create();

    let testDateFrom0 = "2020-06-09T05:53:49+02:00";
    let testDateTo0 = "2020-07-09T05:53:49+02:00";
    let testDateFrom1 = "2020-06-09T05:53:49+02:00";
    let testDateTo1 = "2020-06-10T05:53:49+02:00";
    let testAmount = 100;

    let data = [];
    data.length = testAmount;
    data.fill({
      validities: [{
        timeFrom: testDateFrom0,
        timeTo: testDateTo0
      }]
    });

    data.push({
      validities: [{
        timeFrom: testDateFrom1,
        timeTo: testDateTo1
      }]
    })
    
    subject.addData(data, 0);
    expect(subject.data[4][0]).toEqual(testAmount);
    expect(subject.data[0][0]).toEqual(1);

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