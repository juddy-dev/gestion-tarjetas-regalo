import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Card } from '../../../models/card.model';
import { AlertService } from '../../../core/services/alerts.service';
import { Transaction } from '../../../models/transaction.model';

const TYPE_NEW = 'COMPRA';

@Component({
  selector: 'app-create-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent {

  private _isOpen: boolean = false;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.idCard = this.generateId();
      this.codeCard = this.generateNumericId();
      this.initialValueControl.reset();
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() closeModal = new EventEmitter<void>();

  idCard: string = '';
  codeCard: string = '';
  initialValueControl = new FormControl(0, [Validators.required, Validators.min(1)]);

  constructor(
    private dataService: DataService,
    private alertService: AlertService) {

  }

  save() {
    if (this.initialValueControl.valid) {
      const newCard = {
        id: this.idCard,
        codeCard: this.codeCard,
        initialValue: this.initialValueControl.value,
        transactions: [
          {
            date: new Date().toISOString(),
            type: TYPE_NEW,
            value: this.initialValueControl.value
          } as Transaction
        ]
      } as Card;

      this.dataService.create(newCard).subscribe(__ => {
        this.alertService.success('La tarjeta se ha generado.');
        this.close();
      }, error => {
        this.alertService.error('Tuvimos un problema, vuelve a intentarlo.');
      });
    }
  }

  close() {
    this.initialValueControl.reset();
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
