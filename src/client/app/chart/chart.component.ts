import { Component, OnInit } from '@angular/core';
import { YahooStockService } from '../shared/yahoo-stock/yahoo-stock.service';
import { CSVService} from '../shared/csv-service/csv.service'


/**
 * This class represents the lazy loaded ChartComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements OnInit{ 
  constructor(private yahooStockService: YahooStockService, private csvService: CSVService){

  }

  symbol: string = 'nflx';
  stock: any;
  stockArr: string[];
  dataPoints: any[] = [];

  ngOnInit(){
    console.log('started chart component');
    this.yahooStockService.get( this.symbol )
                      .subscribe(result => this.processData(result))
  }

  processData(result){
      this.stock = result
      console.log(`stock result: ${this.stock}`);
      this.stockArr = this.csvService.CSVToArray(this.stock)
      this.stockArr = this.stockArr.reverse();
      this.stockArr.shift();
      console.log('stockArray: ',this.stockArr);
      for(var i = 0; i< this.stockArr.length; i++){
          this.dataPoints.push(
              {
                  x: new Date(this.stockArr[i][0]),
                  y:[
                      +this.stockArr[i][1],
                      +this.stockArr[i][2],
                      +this.stockArr[i][3],
                      +this.stockArr[i][4]
                  ]
              }
          )           
      }

      this.showChart();
  }

  showChart(){

    var chart = new CanvasJS.Chart("chartContainer",
      {
        title:{
          text: "chartContainer",
        },
        exportEnabled: false,
        axisY: {
          includeZero: false,
          prefix: "$",
        },
        axisX: {
          valueFormatString: "DD-MMM",
        },
        data: [
        {
          type: "candlestick", 
          dataPoints: this.dataPoints
          /*
          dataPoints: [
            {x: new Date('1970-01-01'), y:[99.91, 100.15, 99.33, 99.61]},
            {x: new Date('1970-01-02'), y:[100.12, 100.45, 99.28, 99.51]},
            {x: new Date('1970-01-03'), y:[99.28, 100.36, 99.27, 99.79]}
            
          ]
          */
          
                
      }
		]
	});
  console.log('dataPoints before chart.render: ', this.dataPoints)
	chart.render();

  }
}
