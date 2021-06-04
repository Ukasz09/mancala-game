import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly logApi = 'http://localhost:3000';
  private timeMeasuresMinimax = [];
  private timeMeasuresAlfabeta = [];
  private movesMeasuresMinimax = [];
  private movesMeasuresAlfabeta = [];

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
    if (algType === 'minimax') {
      this.timeMeasuresMinimax.push(measure);
    } else {
      this.timeMeasuresAlfabeta.push(measure);
    }
  }

  public requestLogTimeMeasure(): void {
    const url = `${this.logApi}/log/all/timeMeasure`;
    this.http.post<void>(url, this.timeMeasuresAlfabeta).subscribe();
    this.http.post<void>(url, this.timeMeasuresMinimax).subscribe();
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
    if (algType === 'minimax') {
      this.movesMeasuresMinimax.push(measure);
    } else {
      this.movesMeasuresAlfabeta.push(measure);
    }
  }

  public requestLogMovesMeasure(): void {
    const url = `${this.logApi}/log/all/movesMeasure`;
    this.http.post<void>(url, this.movesMeasuresMinimax).subscribe();
    this.http.post<void>(url, this.movesMeasuresAlfabeta).subscribe();
  }

  public requestLogMeasures(): void {
    this.requestLogTimeMeasure();
    this.requestLogMovesMeasure();
    this.clearMeasures();
  }

  public clearMeasures(): void {
    this.movesMeasuresAlfabeta = [];
    this.movesMeasuresMinimax = [];
    this.timeMeasuresAlfabeta = [];
    this.timeMeasuresMinimax = [];
  }
}
