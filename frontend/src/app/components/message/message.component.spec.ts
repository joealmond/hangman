import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { MessageService } from '../../services/standard-message.service';
import { of } from 'rxjs';
import { GameMessage, MessageType } from '../../constants/game-constants';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let messageService: MessageService;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'message$',
    ]);

    TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [{ provide: MessageService, useValue: messageServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive messageService', () => {
    expect(messageService).toBeTruthy();
  });

  it('should subscribe to currentMessage on ngOnInit', () => {
    const mockMessage: GameMessage = {
      text: 'Test message',
      type: MessageType.PLACEHOLDER,
      displayTime: 0,
    };
    (messageService.message$ as any) = of(mockMessage);

    fixture.detectChanges();
    component.ngOnInit();

    expect(component.currentMessage).toEqual(mockMessage);
  });

  it('should destroy subscription on ngOnDestroy', () => {
    component.subscription = { unsubscribe: jasmine.createSpy() } as any;
    component.ngOnDestroy();
    if (component.subscription?.unsubscribe) {
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    }
  });

  it('test getMessage', () => {
    const mockMessage: GameMessage = {
      text: 'Test message',
      type: MessageType.PLACEHOLDER,
      displayTime: 0,
    };
    component.currentMessage = mockMessage;
    expect(component.getMessage()).toEqual('Test message');
  });

  it('test getMessageType', () => {
    const mockMessage: GameMessage = {
      text: 'Test message',
      type: MessageType.PLACEHOLDER,
      displayTime: 3000,
    };
    component.currentMessage = mockMessage;
    expect(component.getMessageType()).toEqual(MessageType.PLACEHOLDER);
  });

  // TODO: more specific tests for message types
});
