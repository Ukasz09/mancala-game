import { Component, Input, OnInit } from '@angular/core';
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
  @Input() holesHighlightClass: string = '';

  constructor() {}

  ngOnInit(): void {}

  getStoneTransformStyle(stone: Stone): string {
    return `translateX(${stone.translatePositonX}px) translateY(${stone.translatePositonY}px) rotate(${stone.rotation}deg)`;
  }
}
