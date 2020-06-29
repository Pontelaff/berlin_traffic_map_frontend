import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartStackedDuration } from './chart-stacked-duration';

describe('ChartStackedDuration', () => {
  let subject: ChartStackedDuration;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartStackedDuration("canvas", allDistricts, allEvents);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets.length).toEqual(subject.strides.length);
  });

  it('should create container', () => {
    expect(subject.data.length).toEqual(subject.strides.length);
  });

  it('should show y axis labels', () => {
    subject.create();

    let label:string;

    /* test whole number label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(1, 0, 0);
    expect(label).toEqual(null);

    /* test offset label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(0.5, 0, 0);
    expect(label).toEqual(subject.strides[0] + " - " + subject.strides[1]);

    /* test max label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(subject.strides.length - 1 + 0.5, 0, 0);
    expect(label).toEqual(subject.strides[subject.strides.length - 1] + "+");
  });

  it('should update mode and time intervals', () => {
    subject.create();

    let testArr: number[] = [0, 5, 10, 15, 35];

    subject.setOpMode(0);
    subject.setStrides(testArr);
    expect(subject.opMode).toEqual(0);
    expect(subject.strides).toEqual(testArr);

    subject.setOpMode(1);
    subject.setStrides(testArr);
    expect(subject.opMode).toEqual(1);
    expect(subject.strides).toEqual(testArr);
  });

  it('should add percentile data', () => {
    subject.create();

    let testArr: number[] = [20, 25, 60, 65, 100];

    subject.setOpMode(1);
    subject.setStrides(testArr);

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
    expect(subject.data[4][0]).toEqual(testAmount)

    /* test if correct label function was applied */
    let label: string;

    /* test whole number label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(1, 0, 0);
    expect(label).toEqual(null);

    /* test offset label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(0.5, 0, 0);
    expect(label).toEqual("0% - " + testArr[0] + "%");

    /* test max label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(subject.strides.length - 1 + 0.5, 0, 0);
    expect(label).toEqual(testArr[testArr.length - 2] + "% - " + testArr[testArr.length - 1] + "%");

  })

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

    /* test if correct label function was applied */
    let label: string;

    /* test whole number label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(1, 0, 0);
    expect(label).toEqual(null);

    /* test offset label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(0.5, 0, 0);
    expect(label).toEqual(subject.strides[0] + " - " + subject.strides[1]);

    /* test max label */
    label = subject.chart.options.scales.yAxes[0].ticks.callback(subject.strides.length - 1 + 0.5, 0, 0);
    expect(label).toEqual(subject.strides[subject.strides.length - 1] + "+");
  });
});