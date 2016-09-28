import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';
import { ChartRoutes } from './chart/index';


export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...ChartRoutes
];
