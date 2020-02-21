import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOverlayComponent } from './dynamic-overlay.component';

describe('DynamicOverlayComponent', () => {
  let component: DynamicOverlayComponent;
  let fixture: ComponentFixture<DynamicOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
