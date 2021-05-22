import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly logApi = 'http://localhost:3000';
  private timeMeasures = [];
  private movesMeasures = [];

  constructor(private http: HttpClient) {}

  public logTimeMeasure(
    time: number,
    depth: number,
    algType: string,
    heuristic: string
  ) {
    const measure = {
      time,
      depth,
      algType,
      heuristic,
    };
    this.timeMeasures.push(measure);
  }

  public requestLogTimeMeasure(): void {
    const url = `${this.logApi}/log/all/timeMeasure`;
    const measures = this.timeMeasures;
    this.http.post<void>(url, measures).subscribe();
  }

  public logMovesMeasure(
    moves: number,
    depth: number,
    algType: string,
    heuristic: string
  ): void {
    const measure = {
      moves,
      depth,
      algType,
      heuristic,
    };
    this.movesMeasures.push(measure);
  }

  public requestLogMovesMeasure(): void {
    const url = `${this.logApi}/log/all/movesMeasure`;
    const measures = this.movesMeasures;
    this.http.post<void>(url, measures).subscribe();
  }

  public requestLogMeasures(): void {
    this.requestLogTimeMeasure();
    this.requestLogMovesMeasure();
    this.clearMeasures();
  }

  public clearMeasures(): void {
    this.movesMeasures = [];
    this.timeMeasures = [];
  }
}
