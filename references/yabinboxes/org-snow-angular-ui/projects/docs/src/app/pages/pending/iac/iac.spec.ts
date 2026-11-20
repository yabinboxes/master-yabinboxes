import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iac } from './iac';

describe('Iac', () => {
  let component: Iac;
  let fixture: ComponentFixture<Iac>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iac]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iac);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
