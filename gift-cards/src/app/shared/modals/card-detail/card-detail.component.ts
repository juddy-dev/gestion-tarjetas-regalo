import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../models/card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-detail',
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {
  @Input() isOpen = false;
  @Input() card: Card = new Card();
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  hasTransactions() {
    return this.card.transactions && this.card.transactions?.length !== 0;
  }
}
