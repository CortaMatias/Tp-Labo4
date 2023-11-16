import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosPacienteComponent } from './turnos-paciente.component';

describe('TurnosPacienteComponent', () => {
  let component: TurnosPacienteComponent;
  let fixture: ComponentFixture<TurnosPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosPacienteComponent]
    });
    fixture = TestBed.createComponent(TurnosPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
