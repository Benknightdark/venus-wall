import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurHashImgComponent } from './blur-hash-img.component';

describe('BlurHashImgComponent', () => {
  let component: BlurHashImgComponent;
  let fixture: ComponentFixture<BlurHashImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlurHashImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlurHashImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
