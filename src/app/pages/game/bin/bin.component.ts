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
  @Input() allStones: Map<number, Stone> = new Map(); // <stone number, stone models>
  @Input() stoneIds: number[] = [];
  @Input() stonesWithMovingAnimation: number[] = []; // stone_number []

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

  public getStone(stoneNumber: number): Stone {
    return this.allStones.get(stoneNumber);
  }

  public getStoneMovingAnimationClass(stoneNumber: number) {
    return this.stonesWithMovingAnimation.includes(stoneNumber) ? `moving` : '';
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */

  get binCssClass(): string {
    return this.isActive ? this.activeBinClass : this.notActiveBinClass;
  }
}
