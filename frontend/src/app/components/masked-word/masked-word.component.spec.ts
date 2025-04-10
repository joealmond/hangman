import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaskedWordComponent } from './masked-word.component';

describe('MaskedWordComponent', () => {
  let component: MaskedWordComponent;
  let fixture: ComponentFixture<MaskedWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskedWordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaskedWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive maskedWord', () => {
    component.maskedWord = 'test-word';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('test-word');
  });

  it('should handle empty maskedWord', () => {
    component.maskedWord = '';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toEqual('?');
  });

});
