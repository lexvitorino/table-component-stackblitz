import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(TableComponent, { static: false }) table: TableComponent;

  dados: any[] = [];

  constructor(private service: AppService) {
    this.table = new TableComponent;
  }

  ngOnInit() {
    this.service.get().subscribe((resp) => {
      this.dados = resp;
      console.log(resp);
    });
  }

  get hasDados(): boolean {
    return this.dados?.length > 0;
  }

  get dadosfilter() {
    if (!this.table) return [];
    if (!this.hasDados) return [];

    if (!this.table.filtro) {
      return this.table.getPage(this.dados);
    }

    return this.table.getPage(this.dadosFilter);
  }

  get dadosFilter() {
    return this.dados.filter(
      (v) =>
        v.dimension.indexOf(this.table.filtro) >= 0 ||
        v.name.indexOf(this.table.filtro) >= 0 ||
        v.type.indexOf(this.table.filtro) >= 0
    );
  }
}
