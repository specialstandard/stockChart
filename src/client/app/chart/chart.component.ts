import { Component, OnInit } from '@angular/core';
import { YahooStockService } from '../shared/yahoo-stock/yahoo-stock.service';
import { CSVService} from '../shared/csv-service/csv.service'
import { SP500 } from '../shared/sp500'
import { PortfolioService} from '../portfolio/portfolio.service'

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
  constructor( private yahooStockService: YahooStockService, 
               private csvService: CSVService,
               private portfolioService: PortfolioService ) {}

  sp500: string[] = []
  symbol: string;
  stock: any;
  stockArr: string[];
  dataPoints: any[] = [];
  equity: any;
  chart:any = null;
  index:number;
  accountValue: number;
  profit: number;
  activePosition: boolean;
  activeLong: boolean;
  activeShort: boolean;
	entryPrice: number;
 	currentPrice: number;
	equityValue: number;
	numShares: number;

  ngOnInit(){
    this.sp500 = SP500.getSP500();
    //console.log('sp500: ', this.sp500)
    console.log('started chart component');
    this.initChart();
    this.accountValue = 10000;
		this.numShares = 0;    
    this.entryPrice = 0;
    this.entryPrice = 0;
    this.equityValue = 0;
    this.activePosition = false;
    this.activeLong = false;
    this.activeShort = false;

  }

  public initChart(){
    this.entryPrice = 0;

    this.index = 120;
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
          year: this.getRandomYear(2001, 2015)
        },
        end:{
          month: 8,
          day: 27,
          year: 2015
        }
      }
    } 
    console.log('random year: ', this.equity.date.start.year)
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

  //   between (min, max) ... (inclusive,exclusive)
  getRandomYear(min, max) {
    return Math.floor( Math.random() * (max - min) + min );
  }

  public buy(){
    this.advanceChart()
    let openPrice = this.dataPoints[this.dataPoints.length-1].y[0]
    this.entryPrice = openPrice;
    this.equityValue = this.accountValue;
    this.numShares = this.accountValue / openPrice;
    this.activePosition = true;
    this.activeLong = true;
  }

  public short(){
    this.advanceChart()
    let openPrice = this.dataPoints[this.dataPoints.length-1].y[0]
    this.entryPrice = openPrice;
    this.numShares = this.accountValue / openPrice;

    this.activePosition = true;
    this.activeShort = true;
  } 

  public buyToCover(){
    this.advanceChart()
    
    this.equityValue = 0;
    this.numShares = 0;  
    this.activePosition = false;
    this.activeShort = false;
  }

  public sellToClose(){
    this.advanceChart()

    this.equityValue = 0;
    this.numShares = 0;    
    this.activePosition = false;
    this.activeLong = false;
  } 

	update( price: number ){
    this.currentPrice = price;
    
    if(this.activeLong){
      this.profit = this.round(((this.currentPrice - this.entryPrice)/ this.entryPrice) * 100);
		  this.equityValue = this.numShares * price;
      this.accountValue = Math.round(this.equityValue);
    } else if(this.activeShort){
      this.updateShort(price, this.dataPoints[this.dataPoints.length-2].y[0])
    }
	}  

  updateShort(price: number, lastPrice: number){
      this.profit = this.round(-((this.currentPrice - this.entryPrice)/ this.entryPrice) * 100);

		  this.equityValue = (this.numShares * (lastPrice - price))
      this.accountValue = Math.round(this.accountValue + this.equityValue); 
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
      this.update(this.dataPoints[this.dataPoints.length-1].y[0]);
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
