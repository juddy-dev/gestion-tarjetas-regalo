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
  selector: 'app-create-card',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent {

  isLoading: boolean = false;
  private _isOpen: boolean = false;
  submitted: boolean = false;

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
  initialValueControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5000000)]);

  constructor(
    private dataService: DataService,
    private alertService: AlertService) {
      this.initialValueControl.reset();
  }

  save() {
    this.submitted = true;
    if (this.initialValueControl.valid) {
      this.isLoading = true;
      const newCard = {
        id: this.idCard,
        initialDate: new Date().toISOString(),
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

      this.dataService.save(newCard).subscribe({
        next: () =>{
          this.alertService.success('La tarjeta se ha generado.', 3);
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
    this.submitted = false;
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
