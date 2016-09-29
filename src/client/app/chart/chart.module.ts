import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { PortfolioService } from '../portfolio/portfolio.service';
import { YahooStockService } from '../shared/yahoo-stock/yahoo-stock.service';
import { CSVService} from '../shared/csv-service/csv.service'


@NgModule({
    imports: [CommonModule],
    declarations: [ChartComponent, PortfolioComponent],
    providers: [YahooStockService, CSVService, PortfolioService],
    exports: [ChartComponent]
})

export class ChartModule { }
