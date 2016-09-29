import { Component, OnInit } from '@angular/core';
import { YahooStockService } from '../shared/yahoo-stock/yahoo-stock.service';
import { CSVService} from '../shared/csv-service/csv.service'
import { SP500 } from '../shared/sp500'

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
  constructor(private yahooStockService: YahooStockService, private csvService: CSVService) {}

  sp500: string[] = []
  symbol: string;
  stock: any;
  stockArr: string[];
  dataPoints: any[] = [];
  equity: any;
  chart:any = null;
  index:number;

  ngOnInit(){
    this.index = 60;
    this.sp500 = SP500.getSP500();
    //console.log('sp500: ', this.sp500)
    console.log('started chart component');
    this.initChart();
  }

  public initChart(){
    if(this.chart){
      this.chart = null;
    }
    this.dataPoints = [];
    this.symbol = this.getRandomSymbol()
    this.equity = {
      symbol: this.symbol,
      date:{
        start:{
          month: 9,
          day: 28,
          year: 2015
        },
        end:{
          month: 8,
          day: 27,
          year: 2015
        }
      }
    }
    this.getEquity(this.equity)
  }  

  getEquity(){
    this.yahooStockService.get( this.equity )
                      .subscribe(result => this.processData(result))
  }
  getRandomSymbol(): string{
    let symbol = this.sp500[ Math.floor(Math.random() * this.sp500.length) ]
    return symbol
  }
  processData(result){
      this.stock = result
      //console.log(`stock result: ${this.stock}`);
      this.stockArr = this.csvService.CSVToArray(this.stock)
      this.stockArr = this.stockArr.reverse();
      this.stockArr.shift();
      //console.log('stockArray: ',this.stockArr);
      for(var i = 0; i< this.index; i++){
          this.dataPoints.push(
              {
                  x: new Date(this.stockArr[i][0]),
                  y:[
                      this.round(+this.stockArr[i][1]),
                      this.round(+this.stockArr[i][2]),
                      this.round(+this.stockArr[i][3]),
                      this.round(+this.stockArr[i][4])
                  ]
              }
          )           
      }

      this.showChart();
  }

  round(num:number){
    return Math.round(num*100)/100;
  }

  advanceChart(){
    if(this.stockArr[this.index]){
      this.dataPoints.shift()
      this.dataPoints.push(
                {
                    x: new Date(this.stockArr[this.index][0]),
                    y:[
                        this.round(+this.stockArr[this.index][1]),
                        this.round(+this.stockArr[this.index][2]),
                        this.round(+this.stockArr[this.index][3]),
                        this.round(+this.stockArr[this.index][4])
                    ]
                }
            )   
      this.showChart()
      this.index++
    }
  }

  showChart(){

    this.chart = new CanvasJS.Chart("chartContainer",
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
	this.chart.render();

  }
}
