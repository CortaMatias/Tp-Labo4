import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmistrarTurnosComponent } from './admistrar-turnos.component';

describe('AdmistrarTurnosComponent', () => {
  let component: AdmistrarTurnosComponent;
  let fixture: ComponentFixture<AdmistrarTurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmistrarTurnosComponent]
    });
    fixture = TestBed.createComponent(AdmistrarTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
