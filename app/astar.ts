
import * as AStar from './../node_modules/astar-typescript/main';
import { Map } from "./interfaces";
import { Tile } from "./interfaces";
import { TileContent } from "./interfaces";
import { Point } from "./interfaces";
import { GameInfo } from "./interfaces";

export class aStarFinder {
    private m_aStarInstance: AStar.AStarFinder;
    private m_grid: AStar.Grid;

    constructor(map: Tile[][], gameInfo: GameInfo) {
        let matrix: any = new Array();
        let xOffset = 10 - gameInfo.Player.Position.X;
        let yOffset = 10 - gameInfo.Player.Position.Y;
        for (let i = 0; i < 20; i++){
            matrix.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        }
        let x = 0;
        let y = 19;
        console.log('here');
        for ( let i = gameInfo.Player.Position.X - 10; i < gameInfo.Player.Position.X + 10; i++) {
            for ( let j = gameInfo.Player.Position.Y - 10; j <gameInfo.Player.Position.Y + 10; j++) {
                console.log('test i ' + i + ' j ' + j);
                if ((i === gameInfo.Player.Position.X) && (j === gameInfo.Player.Position.Y)) {
                    console.log('in if');
                    matrix[x][y] = 0;
                }else {
                    console.log('content ' + map[i][j].Content);
                    switch (map[i][j].Content) {
                        case (TileContent.Empty): matrix[x][y] = 0; break;
                        case(TileContent.House): matrix[x][y] = 1; break;
                        case(TileContent.Lava): matrix[x][y] = 1; break;
                        case(TileContent.Player): matrix[x][y] = 1; break;
                        case(TileContent.Resource): matrix[x][y] = 1; break;
                        case(TileContent.Shop): matrix[x][y] = 1; break;
                        case(TileContent.Wall): matrix[x][y] = 1; break;
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

    public generatePath(startPos:Point, finalPoint: Point): any {
        let startPosTemp = [startPos.X, startPos.Y];
        let goalPosTemp = [finalPoint.X, finalPoint.Y];
        return this.m_aStarInstance.findPath(startPosTemp, goalPosTemp);
    }
}