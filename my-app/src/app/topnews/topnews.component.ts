import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details-page/details.service'
import { Article } from '../interfaces/Article'
@Component({
  selector: 'app-topnews',
  templateUrl: './topnews.component.html',
  styleUrls: ['./topnews.component.css']
})
export class TopnewsComponent implements OnInit {

  @Input() ticker: string;
  constructor(private detailsService: DetailsService) { }

  Articles: Article[] = []
  ngOnInit(): void {
    this.getNews(this.ticker)
  }

  getNews(ticker: String) {
    this.detailsService.getNewsData(ticker)
      .subscribe(value => this.Articles = value)
  }

  validArticle(article: Article): boolean {
    return article.urlToImage != null && article.title != null;
  }
}
