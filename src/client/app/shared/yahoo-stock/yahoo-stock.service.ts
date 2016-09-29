import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';

@Injectable()
export class YahooStockService {
    constructor(private http: Http){

    }
    get( equity:any ): Observable<string> {
        console.log('equity obj: ', equity)
        const url:string = 'http://real-chart.finance.yahoo.com/table.csv?' +
                `s=${equity.symbol}` +
                `&a=${equity.date.start.month}` +
                `&b=${equity.date.start.day}` +
                `&c=${equity.date.start.year}` +
                //`&d=${equity.date.end.month}` +
                //`&e=${equity.date.end.day}` +
                //`&f=${equity.date.end.year}` +
                `&g=d&ignore=.csv`;

        console.log('equity url: ', url)
        return this.http.get(url)
                .map(r => r.text())                    
    }

}