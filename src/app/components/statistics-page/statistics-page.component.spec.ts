import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPageComponent } from './statistics-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputChecker } from './inputChecker';

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

  it('should correctly refill stride boxes on count change', () => {
    let stridesLength: number = 0;
    component.customTimeStridesAmount = 7;
    component.cachedOpMode = 0;
    
    component.userSubmitAmount();
    stridesLength = component.customTimeStrides.length;
    expect(stridesLength).toEqual(7);
    expect(component.customTimeStrides[stridesLength - 1]).toEqual(Math.pow(2, 6));
    

    component.customTimeStridesAmount = 9;
    component.cachedOpMode = 1;

    component.userSubmitAmount();
    stridesLength = component.customTimeStrides.length;
    expect(stridesLength).toEqual(9);
    expect(component.customTimeStrides[stridesLength - 1]).toEqual(100);
    expect(component.customTimeStrides[stridesLength - 2]).toEqual(Math.round(100 * (7 / 8)));

  });
  
  it('should detect incorrectly formatted input for stride amount', () => {

    component.customTimeStridesAmount = 5;
    expect(component.checkAmountInput()).toBeTrue();

    component.customTimeStridesAmount = 2;
    expect(component.checkAmountInput()).toBeTrue();

    component.customTimeStridesAmount = 10;
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
});
