#!/bin/bash

sed -i 's/\/assets\//\/mancala-game\/assets\//' ./src/app/shared/styles/utilities/_variables.scss
sed -i 's/\/assets\//\/mancala-game\/assets\//' ./src/app/pages/game/board/board-constants.ts
echo "Changed assets for deploy"
