import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Card } from '../../../models/card.model';
import { AlertService } from '../../../core/services/alerts.service';
import { Transaction } from '../../../models/transaction.model';
import { LoaderComponent } from '../../components/loader/loader.component';

const TYPE_NEW = 'CARGA INICIAL';

@Component({
  selector: 'app-create-multiple-cards',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './create-multiple-cards.component.html',
  styleUrl: './create-multiple-cards.component.css'
})
export class CreateMultipleCardsComponent {

  isLoading: boolean = false;
  @Input() isOpen = false;

  @Output() closeModal = new EventEmitter<void>();

  initialValueControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5000000)]);
  qunatityCardsControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]);

  constructor(
    private dataService: DataService,
    private alertService: AlertService) {
      this.initialValueControl.reset();
      this.qunatityCardsControl.reset();

  }

  save() {
    if (this.initialValueControl.valid && this.qunatityCardsControl.valid) {
      this.isLoading = true;
      const qty = this.qunatityCardsControl.value ?? 0;
      const newCards = Array.from({ length: qty }, (_, i) => ({
        app: 'gift-cards',//esto es requerimiento de la api
        initialDate: new Date().toISOString(),
        id: this.generateId(),
        codeCard: this.generateNumericId(),
        initialValue: this.initialValueControl.value,
        transactions: [
          {
            date: new Date().toISOString(),
            type: TYPE_NEW,
            value: this.initialValueControl.value
          } as Transaction
        ]
      } as Card));

      this.dataService.createMultiple(newCards).subscribe({
        next: () =>{
          this.alertService.success('Las tarjetas se han generado, tal vez tarden un poco en visualizarse.', 5);
          this.close();
        },
        error: () => {
          this.alertService.error('Tuvimos un problema, vuelve a intentarlo.', 3);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  close() {
    this.initialValueControl.reset();
    this.qunatityCardsControl.reset();
    this.closeModal.emit();
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 10) +
           Date.now().toString(36).substring(4, 12);
  }

  generateNumericId(): string {
    const timestamp = Date.now().toString().slice(-8);
    const randomPart = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    return timestamp + randomPart;
  }
  

}
