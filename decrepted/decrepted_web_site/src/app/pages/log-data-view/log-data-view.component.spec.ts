import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogDataViewComponent } from './log-data-view.component';

describe('LogDataViewComponent', () => {
  let component: LogDataViewComponent;
  let fixture: ComponentFixture<LogDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogDataViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
