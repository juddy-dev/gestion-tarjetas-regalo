import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/modals/header/header.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Card } from '../../models/card.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardDetailComponent } from '../../shared/modals/card-detail/card-detail.component';
import { CreateCardComponent } from '../../shared/modals/create-card/create-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, CardDetailComponent, CreateCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isGridView: boolean = false;
  giftCardsFiltered: Card[] = [];
  giftCards: Card[] = [];
  filterlControl = new FormControl('');
  cardSelected: Card = new Card();
  isOpenModalCardDetail = false;
  isOpenModalCreateCard = false;

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
    this.isOpenModalCreateCard = true;
  }

  createMultiplesCard() {
    
  }

  viewTransactions(card: Card) {
    this.cardSelected = card;
    this.isOpenModalCardDetail = true;
  }

  closeModalCardDetail() {
    this.isOpenModalCardDetail = false;
  }

  closeModalCreateCard() {
    this.isOpenModalCreateCard = false;
    this.loadCards();
  }

}
