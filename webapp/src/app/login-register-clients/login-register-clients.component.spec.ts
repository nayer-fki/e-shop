import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterClientsComponent } from './login-register-clients.component';

describe('LoginRegisterClientsComponent', () => {
  let component: LoginRegisterClientsComponent;
  let fixture: ComponentFixture<LoginRegisterClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegisterClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
