import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedOrdersComponent } from './confirmed-orders.component';

describe('ConfirmedOrdersComponent', () => {
  let component: ConfirmedOrdersComponent;
  let fixture: ComponentFixture<ConfirmedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
