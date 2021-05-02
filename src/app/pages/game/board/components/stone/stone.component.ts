import { Component, Input, OnInit } from '@angular/core';
import { Stone } from '../../models/stone';

@Component({
  selector: 'app-stone',
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.scss'],
})
export class StoneComponent implements OnInit {
  @Input() size: number;
  @Input() stone: Stone;

  constructor() {}

  ngOnInit(): void {}

  getStoneTransformStyle(stone: Stone): string {
    return `translateX(${stone.translatePositonX}px) translateY(${stone.translatePositonY}px) rotate(${stone.rotation}deg)`;
  }
}
