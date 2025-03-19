import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyContactInfoComponent } from './company-contact-info.component';

describe('CompanyContactInfoComponent', () => {
  let component: CompanyContactInfoComponent;
  let fixture: ComponentFixture<CompanyContactInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CompanyContactInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
