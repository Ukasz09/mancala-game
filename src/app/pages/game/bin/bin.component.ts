import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stone } from '../models';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss'],
})
export class HoleComponent implements OnInit {
  @Input() size: number;
  @Input() stoneSize: number;
  @Input() isActive = false;
  @Input() allStones: Map<number, Stone> = new Map(); // <stone id, stone models>
  @Input() stoneIds: number[] = [];

  @Output() stoneClick: EventEmitter<void> = new EventEmitter();

  private readonly activeBinClass = 'actual-player-move';
  private readonly notActiveBinClass = 'other-player-move';

  constructor() {}

  ngOnInit(): void {}

  public getStoneTransformStyle(stone: Stone): string {
    return `translateX(${stone.translatePositonX}px) translateY(${stone.translatePositonY}px) rotate(${stone.rotation}deg)`;
  }

  public onStoneClick(): void {
    if (this.isActive) {
      this.stoneClick.emit();
    }
  }

  public getStone(stoneId: number): Stone {
    return this.allStones.get(stoneId);
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */

  get binCssClass(): string {
    return this.isActive ? this.activeBinClass : this.notActiveBinClass;
  }
}
