import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personalization } from './personalization';

describe('Personalization', () => {
  let component: Personalization;
  let fixture: ComponentFixture<Personalization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personalization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Personalization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
