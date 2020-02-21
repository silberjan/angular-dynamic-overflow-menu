import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DynamicOverlayComponent } from './dynamic-overlay.component'
import { DynamicOverlayModule } from './dynamic-overlay.module'

describe('DynamicOverlayComponent', () => {
  let component: DynamicOverlayComponent
  let fixture: ComponentFixture<DynamicOverlayComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DynamicOverlayModule],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicOverlayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  test('should create', () => {
    expect(component).toBeTruthy()
  })
})
