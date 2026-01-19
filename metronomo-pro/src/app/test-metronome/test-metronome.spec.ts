import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMetronome } from './test-metronome';

describe('TestMetronome', () => {
  let component: TestMetronome;
  let fixture: ComponentFixture<TestMetronome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMetronome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMetronome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
