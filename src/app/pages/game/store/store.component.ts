import { Component, Input, OnInit } from '@angular/core';
import { Stone } from '../models';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  @Input() allStones: Map<number, Stone> = new Map(); // <stone id, stone models>
  @Input() stoneIds: number[] = [];
  @Input() stoneSize: number;

  constructor() {}

  ngOnInit(): void {}

  public getStone(stoneId: number): Stone {
    return this.allStones.get(stoneId);
  }
}
