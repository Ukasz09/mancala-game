import { Component, OnInit } from '@angular/core';
import { Player } from './models/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  actualPlayerMove: Player = Player.RIGHT_PLAYER;

  constructor() {}

  ngOnInit(): void {}
}
