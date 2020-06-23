import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPageComponent } from './statistics-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatisticsPageComponent', () => {
  let component: StatisticsPageComponent;
  let fixture: ComponentFixture<StatisticsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsPageComponent ],
      imports: [ HttpClientTestingModule ]
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

  
  it('should create chart after click', () => {
    spyOn(component, 'createChart');
    spyOn(component, 'makeData');
    component.selectedChartIndex = 0;
    component.userClick();
    
    expect(component.createChart).toHaveBeenCalled();
    expect(component.makeData).toHaveBeenCalled();
  });
  
  it('should update duration controls', () => {
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
