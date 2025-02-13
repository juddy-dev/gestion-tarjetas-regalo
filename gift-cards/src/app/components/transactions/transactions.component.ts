import { Component } from '@angular/core';
import { AlertService } from '../../core/services/alerts.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-transactions',
  imports: [HeaderComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  constructor(private alertService: AlertService,
    private dataService: DataService
  ){
    this.alertService.success('asdasdas', 10);
  }

}
