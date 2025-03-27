import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstimateComponent } from './estimate.component';

describe('EstimateComponent', () => {
  let component: EstimateComponent;
  let fixture: ComponentFixture<EstimateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EstimateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
