import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabelPosition } from '../../../../../shared/models/enums';
import { Stone } from '../../models/stone';

@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss'],
})
export class HoleComponent implements OnInit {
  @Input() size: number;
  @Input() imageUrl: string;
  @Input() stones: Stone[] = [];
  @Input() stoneSize: number;
  @Input() isActive = false;

  @Output() stoneClick: EventEmitter<void> = new EventEmitter();

  private readonly activeHoleClass = 'actual-player-move';
  private readonly notActiveHoleClass = 'other-player-move';

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

  /* ------------------------------------------- Getters / setters ------------------------------------------- */

  get holeCssClass(): string {
    return this.isActive ? this.activeHoleClass : this.notActiveHoleClass;
  }
}
