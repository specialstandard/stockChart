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
    get(symbol: string): Observable<string> {
        const url:string = 'http://real-chart.finance.yahoo.com/table.csv?s=' + symbol + '&a=02&b=27&c=2015&d=08&e=27&f=2015&g=d&ignore=.csv';

        return this.http.get(url)
                .map(r => r.text())                    
    }

    do(){
       
    }
    processData(data: any) {
        console.log('test');
    }
}