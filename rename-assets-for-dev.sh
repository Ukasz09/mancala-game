#!/bin/bash

sed -i 's/\/mancala-game\/assets\//\/assets\//' ./src/app/shared/styles/utilities/_variables.scss
sed -i 's/\/mancala-game\/assets\//\/assets\//' ./src/app/pages/game/board/board-constants.ts
echo "Changed assets for dev"


