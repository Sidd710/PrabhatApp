import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantProfileComponent } from './merchant-profile.component';

describe('MerchantProfileComponent', () => {
  let component: MerchantProfileComponent;
  let fixture: ComponentFixture<MerchantProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MerchantProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
