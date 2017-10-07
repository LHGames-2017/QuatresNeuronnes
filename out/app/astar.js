"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AStar = require("./../node_modules/astar-typescript/main");
const interfaces_1 = require("./interfaces");
class aStarFinder {
    constructor(map, gameInfo) {
        let matrix = new Array();
        let xOffset = 10 - gameInfo.Player.Position.X;
        let yOffset = 10 - gameInfo.Player.Position.Y;
        for (let i = 0; i < 20; i++) {
            matrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        let x = 0;
        let y = 19;
        console.log('here');
        for (let i = gameInfo.Player.Position.X - 10; i < gameInfo.Player.Position.X + 10; i++) {
            for (let j = gameInfo.Player.Position.Y - 10; j < gameInfo.Player.Position.Y + 10; j++) {
                console.log('test i ' + i + ' j ' + j);
                if ((i === gameInfo.Player.Position.X) && (j === gameInfo.Player.Position.Y)) {
                    console.log('in if');
                    matrix[x][y] = 0;
                }
                else {
                    console.log('content ' + map[i][j].Content);
                    switch (map[i][j].Content) {
                        case (interfaces_1.TileContent.Empty):
                            matrix[x][y] = 0;
                            break;
                        case (interfaces_1.TileContent.House):
                            matrix[x][y] = 1;
                            break;
                        case (interfaces_1.TileContent.Lava):
                            matrix[x][y] = 1;
                            break;
                        case (interfaces_1.TileContent.Player):
                            matrix[x][y] = 1;
                            break;
                        case (interfaces_1.TileContent.Resource):
                            matrix[x][y] = 1;
                            break;
                        case (interfaces_1.TileContent.Shop):
                            matrix[x][y] = 1;
                            break;
                        case (interfaces_1.TileContent.Wall):
                            matrix[x][y] = 1;
                            break;
                    }
                }
                y--;
            }
            y = 19;
            x++;
        }
        console.log(matrix);
        this.m_grid = new AStar.Grid(matrix);
        let diagonalMovement = false;
        this.m_aStarInstance = new AStar.AStarFinder(this.m_grid, diagonalMovement);
    }
    generatePath(startPos, finalPoint) {
        let startPosTemp = [startPos.X, startPos.Y];
        let goalPosTemp = [finalPoint.X, finalPoint.Y];
        return this.m_aStarInstance.findPath(startPosTemp, goalPosTemp);
    }
}
exports.aStarFinder = aStarFinder;
//# sourceMappingURL=astar.js.map