import { Component, OnInit, Input, Inject } from '@angular/core';
import { Article } from '../interfaces/Article'
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {

  @Input() Article: Article;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  openDialog() {
    this.dialog.open(NewsModalComponent, {
      data: this.Article
    });
  }

}

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.html',
})
export class NewsModalComponent {

  Article: Article
  constructor(@Inject(MAT_DIALOG_DATA) public data: Article,
    private dialogRef: MatDialogRef<NewsModalComponent>) {
    this.Article = data
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatDate(date: Date): string {
    return moment(date).format('MMMM DD, YYYY')
  }

  getTwitterURL() {
    // return "https://twitter.com/intent/tweet?text=Hello%20world"
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.Article.title)}%20
    ${encodeURIComponent(this.Article.url)}`
  }

  getFacebookURL() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.Article.url)}&amp;src=sdkpreparse`

  }
}
