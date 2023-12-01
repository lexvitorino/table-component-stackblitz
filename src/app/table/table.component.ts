import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() showFilter = true;

  constructor() {}

  public filtro: string = '';
  public showing: string = '';

  private timeOutKeyboard: any;

  public paginator: {
    pageIndex: number;
    pageSize: number;
    totalPage: number;
    pageActual: number;
    pages: number[];
    pageItems: any[];
    pageItemsPage: any[];
  } = {
    pageIndex: 0,
    pageSize: 10,
    totalPage: 0,
    pageActual: 0,
    pages: [],
    pageItems: [],
    pageItemsPage: [],
  };

  ngOnInit() {}

  onPaginationSize(event: any) {
    if (event && event.target) {
      this.paginator.pageSize = +event.target.value;
      this.paginator.pageActual = 1;
    }

    this.getShowing();
  }

  onFilter(event: any) {
    if (this.timeOutKeyboard) clearTimeout(this.timeOutKeyboard);
    this.timeOutKeyboard = setTimeout(() => {
      if (event && event.target) this.filtro = event.target.value;
    }, 1500);
  }

  getPage(dados: any) {
    return this.listItems(
      dados,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }

  pagination() {
    if (this.paginator.pageIndex + 1 > this.paginator.totalPage) {
      this.paginator.pageIndex = 0;
    }

    const maxlinks = 2;
    const page = this.paginator.pageIndex + 1;

    this.paginator.pages = [];
    if (this.paginator.pageItems?.length > 0) {
      for (let pageant = page - maxlinks; pageant <= page - 1; pageant++) {
        if (pageant >= 1) {
          this.paginator.pages.push(pageant);
        }
      }

      this.paginator.pages.push(page);

      for (let pagedep = page + 1; pagedep <= page + maxlinks; pagedep++) {
        const qtRegPageMax = page * this.paginator.pageSize;
        if (
          this.paginator.pageItems.length <= qtRegPageMax ||
          this.paginator.pageItems.length > qtRegPageMax
        )
          if (pagedep <= this.paginator.totalPage)
            this.paginator.pages.push(pagedep);
      }
    }
  }

  listItems(pageItems = [], pageActual = 1, limitItems = 10): any[] {
    if (limitItems === -1) {
      limitItems = pageItems.length;
    }

    this.paginator.pageActual = pageActual;

    if (!pageItems || pageItems?.length === 0) {
      this.paginator.pages = [];
      return [];
    }

    this.paginator.pageItems = pageItems;
    this.paginator.totalPage = Math.ceil(pageItems.length / limitItems);
    this.pagination();

    let result: any[] = [];
    const vpageActual = pageActual > this.paginator.totalPage ? 1 : pageActual;
    let count = +vpageActual * +limitItems - +limitItems;
    let delimiter = count + +limitItems;
    if (+vpageActual <= this.paginator.totalPage) {
      for (let i = count; i < delimiter; i++) {
        if (pageItems[i] != null) {
          result.push(pageItems[i]);
        }
        count++;
      }
    }

    this.paginator.pageItemsPage = result;

    this.getShowing();

    return result;
  }

  getShowing() {
    let pageSize = this.paginator.pageSize;

    if (this.paginator.pageSize == -1) {
      pageSize = this.paginator.pageItems.length;
    }

    let end: number = 0;
    if (
      pageSize * this.paginator.pageActual <=
      this.paginator.pageItems.length
    ) {
      end = pageSize * this.paginator.pageActual;
    } else {
      end = this.paginator.pageItems.length;
    }

    this.showing = `Mostrando de ${
      pageSize * this.paginator.pageActual - pageSize + 1
    } até ${end} de ${this.paginator.pageItems.length}`;
  }

  firstPage() {
    this.paginator.pageIndex = 0;
  }

  lastPage() {
    this.paginator.pageIndex = this.paginator.totalPage - 1;
  }

  priorPage() {
    this.paginator.pageIndex = this.paginator.pageIndex - 1;
  }

  nextPage() {
    this.paginator.pageIndex = this.paginator.pageIndex + 1;
  }

  selectPage(page: number): string {
    return this.paginator.pageIndex === page - 1 ? 'active disabled' : '';
  }

  page(p: number) {
    this.paginator.pageIndex = p - 1;
  }

  get firstPageDisabled(): string {
    return this.paginator.pageIndex === 0 ? 'disabled' : '';
  }

  get lastPageDisabled(): string {
    return this.paginator.pageIndex + 1 === this.paginator.totalPage
      ? 'disabled'
      : '';
  }

  get priorPageDisabled(): string {
    const page = this.paginator.pageIndex - 1;
    return page < 0 ? 'disabled' : '';
  }

  get nextPageDisabled(): string {
    const page = this.paginator.pageIndex + 1;
    return page === this.paginator.totalPage ? 'disabled' : '';
  }

  get showPagination(): boolean {
    return !!this.paginator.pages && this.paginator.pages.length > 1;
  }
}
