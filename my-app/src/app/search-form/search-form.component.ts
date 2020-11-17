import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, debounceTime, switchMap, finalize, distinctUntilChanged } from 'rxjs/operators';
import { AutocompleteService } from './autocomplete.service'
import { Autocomplete } from './autocomplete'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  constructor(private autocompleteService: AutocompleteService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  myControl = new FormControl();
  filteredOptions: Observable<Autocomplete[]>;
  isLoading: boolean = false;
  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   tap(() => this.isLoading = true),
    //   switchMap((value: string) => this.getSuggestions(value).pipe(
    //     tap(() => this.isLoading = false)
    //   ))
    // )

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(value =>
    //     this.getSuggestions(value))
    // );

    this.myControl.valueChanges.subscribe(
      value => { if (value.length > 0) this.filteredOptions = this.getSuggestions(value) }
    )

  }

  filter(value: string) {
    // return this.autocompleteService.getSuggestions(value).pipe(
    //   map(response)
    // )
  }


  displayTicker(autocomplete: Autocomplete): string {
    return autocomplete.ticker;
  }

  onSubmit() {
    if (this.myControl.value == '') return;
    var query = (this.myControl.value.ticker || this.myControl.value).toLowerCase();
    this.router.navigate(['/details', query])
  }

  getSuggestions(query: String): Observable<Autocomplete[]> {
    return this.autocompleteService
      .getSuggestions(query)
  }

}
