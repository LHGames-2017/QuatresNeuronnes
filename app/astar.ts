
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
        
        for ( let i = 0; i < 20; i++) {
            for ( let j = 0; j < 20; j++) {
                if ((i === 10) && (j === 10)) {
                    matrix[j][i] = 0;
                }else {
                    switch (map[i][j].Content) {
                        case (TileContent.Empty): matrix[j][i] = 0; break;
                        case(TileContent.House): matrix[j][i] = 0; break;
                        case(TileContent.Lava): matrix[j][i] = 1; break;
                        case(TileContent.Player): matrix[j][i] = 1; break;
                        case(TileContent.Resource): matrix[j][i] = 0; break;
                        case(TileContent.Shop): matrix[j][i] = 1; break;
                        case(TileContent.Wall): matrix[j][i] = 1; break;
                    }
                }
            }
        }
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