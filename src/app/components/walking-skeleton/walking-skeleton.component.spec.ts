import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkingSkeletonComponent } from './walking-skeleton.component';

describe('WalkingSkeletonComponent', () => {
  let component: WalkingSkeletonComponent;
  let fixture: ComponentFixture<WalkingSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkingSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
