import { Component, OnInit } from '@angular/core';
import { Heuristics } from 'src/app/game-logic/heuristics';
import { ReportMaker } from 'src/app/game-logic/report-maker';
import { LoggerService } from 'src/app/services/logger.service';
import { GameMode } from 'src/app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  GameMode = GameMode;

  reportMaker: ReportMaker; // For performace reports purpose

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.reportMaker = new ReportMaker(this.logger);
  }

  public getGameModeUrl(mode: string): string {
    return `/game/${mode}`;
  }

  public makeReport() {
    console.clear();
    this.reportMaker.makeReport(3, 5, Heuristics.SIMPLE);
    // this.reportMaker.makeReport(4, 5, Heuristics.SIMPLE);
    // this.reportMaker.makeReport(5, 5, Heuristics.SIMPLE);
    // this.reportMaker.makeReport(6, 5, Heuristics.SIMPLE);
    // this.reportMaker.makeReport(7, 5, Heuristics.SIMPLE);
    this.reportMaker.makeReport(3, 5, Heuristics.RANDOM);
    // this.reportMaker.makeReport(4, 5, Heuristics.RANDOM);
    // this.reportMaker.makeReport(5, 5, Heuristics.RANDOM);
    // this.reportMaker.makeReport(6, 5, Heuristics.RANDOM);
    // this.reportMaker.makeReport(7, 5, Heuristics.RANDOM);
    this.reportMaker.makeReport(3, 5, Heuristics.SIMPLE_EXTENDED);
    // this.reportMaker.makeReport(4, 5, Heuristics.SIMPLE_EXTENDED);
    // this.reportMaker.makeReport(5, 5, Heuristics.SIMPLE_EXTENDED);
    // this.reportMaker.makeReport(6, 5, Heuristics.SIMPLE_EXTENDED);
    // this.reportMaker.makeReport(7, 5, Heuristics.SIMPLE_EXTENDED);
  }
}
