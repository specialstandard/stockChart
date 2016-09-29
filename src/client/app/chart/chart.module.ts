import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { YahooStockService } from '../shared/yahoo-stock/yahoo-stock.service';
import { CSVService} from '../shared/csv-service/csv.service'


@NgModule({
    imports: [CommonModule],
    declarations: [ChartComponent],
    providers: [YahooStockService, CSVService],
    exports: [ChartComponent]
})

export class ChartModule { }
