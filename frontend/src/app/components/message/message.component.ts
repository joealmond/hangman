import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/standard-message.service';
import {
  MessageType,
  messageTypeClasses,
} from '../../constants/game-constants';
import { GameMessage } from '../../models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MessageComponent implements OnInit, OnDestroy {
  currentMessage: GameMessage = {
    text: '',
    type: MessageType.PLACEHOLDER,
    displayTime: 0,
  };
  private subscription: Subscription | null = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.subscription = this.messageService.message$.subscribe((message) => {
      this.currentMessage = message;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  getMessage(): string {
    return this.currentMessage.text;
  }

  getMessageType(): string {
    const className = messageTypeClasses[this.currentMessage.type];
    return className;
  }
}
