import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DynamicOverlayComponent } from './dynamic-overlay.component'
import { DynamicOverlayModule } from './dynamic-overlay.module'
import { Component } from '@angular/core'
import { OverlayContainer, Overlay } from '@angular/cdk/overlay'
import { By } from '@angular/platform-browser'

@Component({
  template: `
    <tgm-dynamic-overlay>
      <ng-template>
        <div class="item" *tgmOverlayBreakpoint="250">1</div>
        <div class="item" *tgmOverlayBreakpoint="300">2</div>
        <div class="item" *tgmOverlayBreakpoint="350">3</div>
        <div class="item" *tgmOverlayBreakpoint="400">4</div>
        <div class="item" *tgmOverlayBreakpoint="500">6</div>
        <div class="item" *tgmOverlayBreakpoint="550">7</div>
      </ng-template>

      <button tgm-dynamic-overlay-trigger>
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </button>
    </tgm-dynamic-overlay>
  `,
})
class TestComponent {}

function resizeWindow(size: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: size })
  window.dispatchEvent(new Event('resize'))
}

describe('DynamicOverlayComponent', () => {
  let component: TestComponent
  let fixture: ComponentFixture<TestComponent>
  let overlayContainerElement: HTMLElement
  let overlay: Overlay

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [DynamicOverlayModule],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div')

            return { getContainerElement: () => overlayContainerElement }
          },
        },
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent)
    component = fixture.componentInstance
    overlay = TestBed.inject(Overlay)

    fixture.detectChanges()
  })

  test('should show all the items in the template', () => {
    const items = fixture.debugElement.queryAll(By.css('.item'))
    expect(items.length).toBe(6)
  })

  test('should hide items based on window width', () => {
    resizeWindow(475)
    fixture.detectChanges()

    const items = fixture.debugElement.queryAll(By.css('.item'))
    expect(items.length).toBe(4)
  })

  test('should show hidden items in overlay based on window width', () => {
    resizeWindow(475)
    fixture.detectChanges()

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement
    button.click()
    fixture.detectChanges()

    const items = overlayContainerElement.querySelectorAll('.item')
    expect(items.length).toBe(2)
  })

  test('should close on backdrop click', () => {
    resizeWindow(475)
    fixture.detectChanges()

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement
    button.click()
    fixture.detectChanges()

    const backdrop: HTMLElement = overlayContainerElement.querySelector('.cdk-overlay-backdrop')
    backdrop.click()
    fixture.detectChanges()

    expect(overlayContainerElement.querySelector('.item')).toBeFalsy()
  })

  test('Should not open twice ', () => {
    resizeWindow(475)
    fixture.detectChanges()

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement
    const overlaySpy = jest.spyOn(overlay, 'create')
    button.click()
    button.click()
    fixture.detectChanges()
    expect(overlaySpy).toHaveBeenCalledTimes(1)
  })
})
