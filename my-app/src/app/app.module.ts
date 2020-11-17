import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FooterComponent } from './footer/footer.component';
import { DetailsPageComponent } from './details-page/details-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { HttpClientModule } from '@angular/common/http';
import { SummaryComponent } from './summary/summary.component';
import { TopnewsComponent } from './topnews/topnews.component';
import { ChartsComponent } from './charts/charts.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HighchartsChartModule } from 'highcharts-angular';
import { NewsCardComponent } from './news-card/news-card.component';
import { BuyModalComponent } from './buy-modal/buy-modal.component';
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { AlertComponent } from './alert/alert.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchFormComponent,
    FooterComponent,
    DetailsPageComponent,
    WatchlistComponent,
    PortfolioComponent,
    SummaryComponent,
    TopnewsComponent,
    ChartsComponent,
    NewsCardComponent,
    BuyModalComponent,
    PortfolioCardComponent,
    WatchlistCardComponent,
    AlertComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    HighchartsChartModule,
    MatProgressSpinnerModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
