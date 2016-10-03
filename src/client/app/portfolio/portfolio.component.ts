import { Component, OnInit, Input } from '@angular/core';
import { PortfolioService} from './portfolio.service'

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-portfolio',
  templateUrl: 'portfolio.component.html',
  styleUrls: ['portfolio.component.css']
})
export class PortfolioComponent implements OnInit{ 

  
  constructor(private portfolioService: PortfolioService){

  }

  @Input() accountValue: number;


  ngOnInit(){
    this.accountValue = this.portfolioService.getAccountValue()
  }
}
 