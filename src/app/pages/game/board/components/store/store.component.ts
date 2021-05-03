import { Component, Input, OnInit } from '@angular/core';
import { LabelPosition } from '../../../../../shared/models/enums';
import { Stone } from '../../models/stone';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() stones: Stone[] = [];
  @Input() stoneSize: number;

  constructor() {}

  ngOnInit(): void {}
}
