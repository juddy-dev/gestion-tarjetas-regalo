import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Card } from '../../models/card.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isGridView: boolean = false;
  giftCardsFiltered: Card[] = [];
  giftCards: Card[] = [];
  filterlControl = new FormControl('');


  constructor(private dataService: DataService) {
    this.filterlControl.valueChanges.subscribe(texto => {
      const valor = texto?.toLowerCase();
      if (valor?.length !== 0) {
        this.giftCardsFiltered = this.giftCards.filter(giftCard => giftCard.id.toLowerCase().includes(valor ?? '') || giftCard.codeCard.toLowerCase().includes(valor ?? ''));
      } else {
        this.giftCardsFiltered = this.giftCards;
      }
    });
  }

  ngOnInit(): void {
    this.loadCards();
  }
  

  toggleCarView() {
    this.isGridView = !this.isGridView;
  }

  loadCards() {
    this.dataService.getAll().subscribe(items => {
      this.giftCards = items;
      this.giftCardsFiltered = items;
    });

  }

  createCard() {

  }

  createMultiplesCard() {
    
  }

  viewTransactions() {

  }

}
