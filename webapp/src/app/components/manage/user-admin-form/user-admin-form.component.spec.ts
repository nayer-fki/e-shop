import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminFormComponent } from './user-admin-form.component';

describe('UserAdminFormComponent', () => {
  let component: UserAdminFormComponent;
  let fixture: ComponentFixture<UserAdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAdminFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
