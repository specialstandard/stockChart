import { Injectable } from '@angular/core';

@Injectable()
export class PortfolioService {
	
	accountValue: number;
	entryPrice: number;
	equityValue: number;
	numShares: number;
	
	constructor(){
		this.accountValue = 10000;
		this.numShares = 0;
		console.log('PortfolioService constructor this.accountValue: ', this.accountValue )
	}


	init(){

	}

	buy( price: number){
		if( this.numShares == 0 ){
			this.entryPrice = price;
			this.equityValue = this.accountValue;
			this.numShares = this.accountValue / price;
		}
	}

	sell( price: number){
		if(this.numShares > 0 ){
			this.equityValue = this.numShares * price;
			this.accountValue = this.equityValue;
			this.equityValue = 0;
			this.numShares = 0;
		}
	}

	getAccountValue(){
		return this.accountValue;
	}

	getProfit(){
		return 
	}

	update( price: number ){
		this.equityValue = this.numShares * price;
		if( this.numShares > 0 ){
			this.accountValue = this.equityValue;
		}
	}
} 