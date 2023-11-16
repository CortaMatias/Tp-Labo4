import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDiasTurnoComponent } from './listado-dias-turno.component';

describe('ListadoDiasTurnoComponent', () => {
  let component: ListadoDiasTurnoComponent;
  let fixture: ComponentFixture<ListadoDiasTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoDiasTurnoComponent]
    });
    fixture = TestBed.createComponent(ListadoDiasTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
