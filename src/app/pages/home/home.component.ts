import { Component, OnInit } from '@angular/core';
import { ReportMaker } from 'src/app/game-logic/report-maker';
import { GameMode } from 'src/app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  GameMode = GameMode;

  reportMaker: ReportMaker; // For performace reports purpose

  constructor() {}

  ngOnInit(): void {
    this.reportMaker = new ReportMaker();
  }

  public getGameModeUrl(mode: string): string {
    return `/game/${mode}`;
  }

  public makeReport() {
    console.clear();
    this.reportMaker.makeReport(3, 10);
    this.reportMaker.makeReport(4, 10);
    this.reportMaker.makeReport(5, 10);
    this.reportMaker.makeReport(6, 10);
    this.reportMaker.makeReport(7, 10);
    this.reportMaker.makeReport(8, 10);
  }
}
