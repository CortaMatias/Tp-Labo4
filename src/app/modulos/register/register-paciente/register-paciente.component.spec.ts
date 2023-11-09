import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPacienteComponent } from './register-paciente.component';

describe('RegisterPacienteComponent', () => {
  let component: RegisterPacienteComponent;
  let fixture: ComponentFixture<RegisterPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPacienteComponent]
    });
    fixture = TestBed.createComponent(RegisterPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
