import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Card } from '../../../models/card.model';
import { AlertService } from '../../../core/services/alerts.service';
import { Transaction } from '../../../models/transaction.model';
import { LoaderComponent } from '../../components/loader/loader.component';


const TYPE_ADD_PAY = 'COMPRA';
const TYPE_ADD_BALANCE = 'RECARGA';

@Component({
  selector: 'app-edit-card',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.css'
})
export class EditCardComponent {

  isLoading: boolean = false;
  private _isOpen: boolean = false;
  submitted: boolean = false;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.initialValueControl.reset();
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
  @Input() card: Card = new Card();

  @Output() closeModal = new EventEmitter<void>();

  idCard: string = '';
  codeCard: string = '';
  initialValueControl = new FormControl(0, [Validators.required, Validators.min(1), Validators.max(1000000)]);

  constructor(
    private dataService: DataService,
    private alertService: AlertService) {
      this.initialValueControl.reset();
  }


  addPayTransaction() {
    this.submitted = true;
    if (this.initialValueControl.valid) {

      this.isLoading = true;
      this.card.transactions.push({
        date: new Date().toISOString(),
        value: this.initialValueControl.value,
        type: TYPE_ADD_PAY
      } as Transaction);
  
      this.dataService.save(this.card).subscribe({
        next: () => {
          this.alertService.success('Se ha agregado el movimiento.', 3);
        },
        error: () => {
          this.alertService.error('Tuvimos un problema, vuelve a intentarlo.', 3);
        },
        complete: () => {
          this.isLoading = false;
          this.close();
        }
      });

    }

  }

  addBalanceTransaction() {
    this.submitted = true;
    if (this.initialValueControl.valid) {
      this.isLoading = true;
      this.card.transactions.push({
        date: new Date().toISOString(),
        value: this.initialValueControl.value,
        type: TYPE_ADD_BALANCE
      } as Transaction);


      this.dataService.save(this.card).subscribe({
        next: () => {
          this.alertService.success('Se ha agregado el movimiento', 3);
        }, 
        error: () => {
          this.alertService.error('Tuvimos un problema, vuelve a intentarlo.', 3);
        },
        complete: () => {
          this.isLoading = false;
          this.close();
        }
      });
    }

  }

  close() {
    this.submitted = false;
    this.initialValueControl.reset();
    this.closeModal.emit();
  }

}
