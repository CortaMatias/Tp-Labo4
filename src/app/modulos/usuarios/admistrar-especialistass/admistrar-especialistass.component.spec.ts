import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmistrarEspecialistassComponent } from './admistrar-especialistass.component';

describe('AdmistrarEspecialistassComponent', () => {
  let component: AdmistrarEspecialistassComponent;
  let fixture: ComponentFixture<AdmistrarEspecialistassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmistrarEspecialistassComponent]
    });
    fixture = TestBed.createComponent(AdmistrarEspecialistassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
