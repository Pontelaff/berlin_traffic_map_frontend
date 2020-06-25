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
    component.userClick();
    
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
  
  it('should update duration controls', () => {
    component.userSwitch(0);
    component.userSwitch(1);

    let ukn: unknown;
    let expVal:string;

    let newVal:string = (<HTMLInputElement>document.getElementById('i2')).value;
    let newMin:string = (<HTMLInputElement>document.getElementById('i2')).min;
    let newMax:string = (<HTMLInputElement>document.getElementById('i2')).max;

    ukn = component.allPercentiles[2];
    expVal = <string>ukn + "";
    expect(newVal).toBe(expVal);

    ukn = component.allPercentiles[1];
    expVal = <string>ukn + "";
    expect(newMin).toBe(expVal);

    ukn = component.allPercentiles[3];
    expVal = <string>ukn + "";
    expect(newMax).toBe(expVal);
  });

});
