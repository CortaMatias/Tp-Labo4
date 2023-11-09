import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEspecialistaComponent } from './register-especialista.component';

describe('RegisterEspecialistaComponent', () => {
  let component: RegisterEspecialistaComponent;
  let fixture: ComponentFixture<RegisterEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterEspecialistaComponent]
    });
    fixture = TestBed.createComponent(RegisterEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
