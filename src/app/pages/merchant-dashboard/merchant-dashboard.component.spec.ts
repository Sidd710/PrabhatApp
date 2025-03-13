import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchantDashboardComponent } from './merchant-dashboard.component';

describe('MerchantDashboardComponent', () => {
  let component: MerchantDashboardComponent;
  let fixture: ComponentFixture<MerchantDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantDashboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
