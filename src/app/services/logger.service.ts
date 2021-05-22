import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly logApi = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public logTimeMeasure(
    time: number,
    depth: number,
    algType: string,
    heuristic: string
  ): void {
    const endpoint = `${this.logApi}/log/timeMeasure?time={time}&depth={depth}&algType={algType}&heuristic={heuristic}`;
    const url = endpoint
      .replace('{time}', time.toString())
      .replace('{depth}', depth.toString())
      .replace('{algType}', algType)
      .replace('{heuristic}', heuristic);

    this.http.post<void>(url, {}).subscribe();
  }

  public logMovesMeasure(
    moves: number,
    depth: number,
    algType: string,
    heuristic: string
  ): void {
    const endpoint = `${this.logApi}/log/movesMeasure?moves={moves}&depth={depth}&algType={algType}&heuristic={heuristic}`;
    const url = endpoint
      .replace('{moves}', moves.toString())
      .replace('{depth}', depth.toString())
      .replace('{algType}', algType)
      .replace('{heuristic}', heuristic);
    this.http.post<void>(url, {}).subscribe();
  }
}
