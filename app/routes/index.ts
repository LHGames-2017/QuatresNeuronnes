import * as express from 'express';
import { GameInfo, Tile, Point } from '../interfaces';
import { AIHelper } from '../aiHelper';
import { aStarFinder } from "./../astar";

module Route {

    export class Index {

        private static decompressMap(compressedMap: any): Tile[][] {
            const map = new Array<Array<Tile>>();
            compressedMap = compressedMap.substring(2, compressedMap.length - 3);
            const row = compressedMap.split('],[');
            for (let i = 0; i < row.length; i++) {
                map[i] = new Array<Tile>();
                const column = row[i].split('{');
                for (let j = 0; j < column.length - 1; j++) {
                    map[i][j] = {
                        Content: +(column[j + 1].split(',')[0]),
                        Position: new Point(
                            column[j + 1].split(',')[1],
                            column[j + 1].split(',')[2].substring(0, column[j + 1].split(',')[2].length - 1)
                        )
                    };
                }
            }
            return map;
        }

        private static backPackIsFull(gameInfo: GameInfo) {
            if (gameInfo.Player.CarriedResources >= gameInfo.Player.CarryingCapacity) {
                return true;
            }
            return false;
        }

        private static getAction(map: Tile[][], gameInfo: GameInfo) {
           console.log(this.findOptimalPathMine(this.getMinerals(map), map, gameInfo));
        }

        private static getMineableMinerals (map: Tile[][], gameInfo: GameInfo): Array<Point> {
            let mineableMinerals = new Array();
            let mineralOnSight = Index.getMinerals(map);
            mineralOnSight.forEach((tile: Tile) => {
                if (tile.Position.Distance(gameInfo.Player.Position) <= 1) {
                    mineableMinerals.push(tile.Position);
                }
            });
            return mineableMinerals;
        }

        private static moveTo(position: Point) {
            return AIHelper.createMoveAction(position);
        }

        private static getMinerals(map: Tile[][]): Array<Tile> {
            const minerals = new Array<Tile>();
            map.forEach((line: Object[]) => {
                line.forEach((tile: Tile) => {
                    if (tile.Content === 4) {
                        minerals.push(tile);
                    }
                });
            });
            return minerals;
        }

        private static printMap(map: Tile[][]): void {
            for (let y = 19; y >= 0; y--) {
                let line = '';
                line += map[0][y].Position.Y + ' ';
                if (map[0][y].Position.Y < 10) {
                    line += ' ';
                }
                for (let x = 0; x < 20; x++) {
                    line += map[x][y].Content + '  ';
                }
                console.log(line);
            }
            let line = '   ';
            for (let x = 0; x < 20; x++) {
                line += map[x][0].Position.X + ' ';
            }
            console.log(line);
        }
        private static findOptimalPathMine(mines:Array<Tile>, map:Tile[][], gameInfo: GameInfo): Array<Point> {
            let aStar = new aStarFinder(map, gameInfo);
            let bestPath: Array<Point>;
            let optimalLength: number = Infinity;
            let playerPosition = new Point(10, 10);
            mines.forEach((mine) => {
                let minePosition = new Point(10 + (mine.Position.X - gameInfo.Player.Position.X), 10 + (mine.Position.Y - gameInfo.Player.Position.Y));
                let path = aStar.generatePath(playerPosition, minePosition);
                if(path.length < optimalLength && path.length > 0) {
                    optimalLength = path.length;
                    let pointArray : Array<Point> = [];
                    path.forEach((position: any) => {
                        let point = new Point(position[0], position[1]);
                        pointArray.push(point);
                    });
                    bestPath = pointArray;
                }
            });
            return bestPath;
        }

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            const mapData = JSON.parse(req.body.map) as GameInfo;
            const map = Index.decompressMap(mapData.CustomSerializedMap);
            Index.printMap(map);
            let action = Index.getAction(map, mapData);
            res.send(action);
        }

        public ping(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.json({ success: true, test: false });
        }
    }
}

export = Route;
