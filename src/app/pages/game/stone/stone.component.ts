import { Component, Input, OnInit } from '@angular/core';
import { Stone } from '../models';

@Component({
  selector: 'app-stone',
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.scss'],
})
export class StoneComponent implements OnInit {
  @Input() size: number;
  @Input() stone: Stone;
  @Input() stoneMovingAnimationClass: string;
  @Input() transitionTimeSec: number;

  constructor() {}

  ngOnInit(): void {}

  /* ------------------------------------------- Getters & Setters ------------------------------------------- */
  get stoneTransformStyle(): string {
    return `translateX(${this.stone.positonX}px) translateY(${this.stone.positonY}px) rotate(${this.stone.rotation}deg)`;
  }
}
