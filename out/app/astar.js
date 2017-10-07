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
        console.log('here');
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if ((i === 10) && (j === 10)) {
                    console.log('in if');
                    matrix[j][i] = 0;
                }
                else {
                    switch (map[i][j].Content) {
                        case (interfaces_1.TileContent.Empty):
                            matrix[j][i] = 0;
                            break;
                        case (interfaces_1.TileContent.House):
                            matrix[j][i] = 0;
                            break;
                        case (interfaces_1.TileContent.Lava):
                            matrix[j][i] = 1;
                            break;
                        case (interfaces_1.TileContent.Player):
                            matrix[j][i] = 1;
                            break;
                        case (interfaces_1.TileContent.Resource):
                            matrix[j][i] = 0;
                            break;
                        case (interfaces_1.TileContent.Shop):
                            matrix[j][i] = 1;
                            break;
                        case (interfaces_1.TileContent.Wall):
                            matrix[j][i] = 1;
                            break;
                    }
                }
            }
        }
        console.log('MATRIX');
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