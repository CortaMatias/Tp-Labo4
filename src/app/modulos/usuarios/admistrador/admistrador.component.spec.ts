import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmistradorComponent } from './admistrador.component';

describe('AdmistradorComponent', () => {
  let component: AdmistradorComponent;
  let fixture: ComponentFixture<AdmistradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmistradorComponent]
    });
    fixture = TestBed.createComponent(AdmistradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
