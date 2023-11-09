import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdministradorComponent } from './register-administrador.component';

describe('RegisterAdministradorComponent', () => {
  let component: RegisterAdministradorComponent;
  let fixture: ComponentFixture<RegisterAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterAdministradorComponent]
    });
    fixture = TestBed.createComponent(RegisterAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
