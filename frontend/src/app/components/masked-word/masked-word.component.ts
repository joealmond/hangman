import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-masked-word',
  templateUrl: './masked-word.component.html',
  styleUrls: ['./masked-word.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MaskedWordComponent {
  @Input() maskedWord: string = '';
}
