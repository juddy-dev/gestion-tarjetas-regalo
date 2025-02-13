import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Card } from '../../models/card.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardDetailComponent } from '../../shared/modals/card-detail/card-detail.component';
import { CreateCardComponent } from '../../shared/modals/create-card/create-card.component';
import { CreateMultipleCardsComponent } from '../../shared/modals/create-multiple-cards/create-multiple-cards.component';
import { LoaderService } from '../../core/services/loader.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, 
    CardDetailComponent, CreateCardComponent, CreateMultipleCardsComponent,
    NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isLoading:boolean = false;
  isEmpty: boolean = false;
  isGridView: boolean = false;
  giftCardsFiltered: Card[] = [];
  giftCards: Card[] = [];
  filterlControl = new FormControl('');
  cardSelected: Card = new Card();
  isOpenModalCardDetail = false;
  isOpenModalCreateCard = false;
  isOpenModalCreateMultipleCards = false;
  page = 1;
  cardsPerPage = 10;

  constructor(
    private dataService: DataService,
    private loaderService: LoaderService) {

    this.loaderService.status().subscribe(status => {
      this.isLoading = status;
    });

    this.filterlControl.valueChanges.subscribe(texto => {
      const valor = texto?.toLowerCase();
      if (valor?.length !== 0) {
        this.giftCardsFiltered = this.giftCards.filter(giftCard => giftCard.id.toLowerCase().includes(valor ?? '') || giftCard.codeCard.toLowerCase().includes(valor ?? ''));
      } else {
        this.giftCardsFiltered = this.giftCards;
      }

      this.isEmpty = this.giftCardsFiltered.length == 0;
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
      this.isEmpty = this.giftCardsFiltered.length == 0;
    });

  }

  createCard() {
    this.isOpenModalCreateCard = true;
  }

  createMultiplesCard() {
    this.isOpenModalCreateMultipleCards = true;
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

  closeModalCreateMulitpleCards() {
    this.isOpenModalCreateMultipleCards = false;
    this.loadCards();
  }

}
