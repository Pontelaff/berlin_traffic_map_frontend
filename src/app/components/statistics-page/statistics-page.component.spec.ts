import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPageComponent } from './statistics-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('StatisticsPageComponent', () => {
  let component: StatisticsPageComponent;
  let fixture: ComponentFixture<StatisticsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsPageComponent ],
      imports: [ HttpClientTestingModule, MaterialModule, BrowserAnimationsModule, FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should process click on plot button', () => {
    spyOn(component, 'createChart');
    spyOn(component, 'makeData');
    component.selectedChartIndex = 0;
    component.userPlot();
    
    expect(component.createChart).toHaveBeenCalled();
    expect(component.makeData).toHaveBeenCalled();
  });

  it('should get loading state when fetching data', () => {
    expect(component.selection).toEqual(null);
    component.selectedChartIndex = 0;
    component.createChart(0);
    component.makeData();

    expect(component.selection.chart.isLoading).toEqual(true);
  });

  it('should create chart and update selection', () => {
    expect(component.selection).toEqual(null);
    component.createChart(0);
    expect(typeof(component.selection.chart)).toEqual("object");
    
    component.selection = null;
    expect(component.selection).toEqual(null);
    component.createChart(1);   
    expect(typeof(component.selection.chart)).toEqual("object");

    component.selection = null;
    expect(component.selection).toEqual(null);
    component.createChart(2);   
    expect(typeof(component.selection.chart)).toEqual("object");

    component.selection = null;
    expect(component.selection).toEqual(null);
    component.createChart(3);   
    expect(typeof(component.selection.chart)).toEqual("object");
  });

  it('should switch stacked duration chart opmode', () => {
    let newOpmode: number;

    newOpmode = 0;
    component.userSwitch(newOpmode);
    expect(component.cachedOpMode).toEqual(newOpmode);
    
    newOpmode = 1;
    component.userSwitch(newOpmode);
    expect(component.cachedOpMode).toEqual(newOpmode);
  });

  it('should detect incorrectly formatted input for stride amount', () => {

    component.customTimeStridesAmount = 5;
    expect(component.checkAmountInput()).toBeTrue();

    component.customTimeStridesAmount = 0;
    expect(component.checkAmountInput()).toBeFalse();

    component.customTimeStridesAmount = 1;
    expect(component.checkAmountInput()).toBeFalse();

    component.customTimeStridesAmount = -1;
    expect(component.checkAmountInput()).toBeFalse();

    component.customTimeStridesAmount = 11;
    expect(component.checkAmountInput()).toBeFalse();
  });

  it('should detect incorrectly formatted input for value amount', () => {

    component.cachedOpMode = 0;

    component.customTimeStrides = [4, 6, 8, 10, 16];
    expect(component.checkStrideInput()).toBeTrue();

    component.customTimeStrides = [0, 2, 4, 10, 10000];
    expect(component.checkStrideInput()).toBeTrue();

    component.customTimeStrides = [0, 2, 4, "70", "150"];
    expect(component.checkStrideInput()).toBeTrue();

    component.customTimeStrides = [0, 4, 2, 10, 10000];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [0, 2.5, 4, 10, 10000];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [-1, 6, 8, 10, 16];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [0, 2, 2, 10, 16];
    expect(component.checkStrideInput()).toBeFalse();

    component.cachedOpMode = 1;

    component.customTimeStrides = [4, 6, 8, 10, 16];
    expect(component.checkStrideInput()).toBeTrue();

    component.customTimeStrides = [1, 2, 4, 10, 100];
    expect(component.checkStrideInput()).toBeTrue();

    component.customTimeStrides = [1, 2, 4, 10, 101];
    expect(component.checkStrideInput()).toBeFalse();
    
    component.customTimeStrides = [0, 4, 2, 10, 10000];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [0, 2.5, 4, 10, 10000];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [-1, 6, 8, 10, 16];
    expect(component.checkStrideInput()).toBeFalse();

    component.customTimeStrides = [0, 2, 2, 10, 16];
    expect(component.checkStrideInput()).toBeFalse();


  });
});
