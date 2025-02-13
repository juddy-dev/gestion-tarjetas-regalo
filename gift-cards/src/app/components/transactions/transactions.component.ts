import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Card } from '../../models/card.model';
import { DataService } from '../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { AlertService } from '../../core/services/alerts.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EditCardComponent } from '../../shared/modals/edit-card/edit-card.component';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-transactions',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, 
    LoaderComponent, EditCardComponent, NgxPaginationModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{

  isLoading = false;
  giftCardsFiltered: Card[] = [];
  giftCards: Card[] = [];
  filterlControl = new FormControl('');
  isOpenModalEditCard = false;
  cardSelected: Card = new Card();
  page = 1;
  cardsPerPage = 10;

  constructor(private dataService: DataService, private alertService: AlertService){

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

  loadCards() {
    this.dataService.getAll().subscribe(items => {
      this.giftCards = items;
      this.giftCardsFiltered = items;
    });

  }

  addTransaction(card: Card) {
    this.isOpenModalEditCard = true;
    this.cardSelected = card;
  }

  closeModalEditCard() {
    this.isOpenModalEditCard = false;
  }
}
