import * as express from 'express';
import { GameInfo, Tile, Point, UpgradeType } from '../interfaces';
import { AIHelper } from '../aiHelper';
import { aStarFinder } from "./../astar";

module Route {

    export class Index {

        private static destination: Point;

        private static price = 15000;
        private static upgradeType = UpgradeType.CarryingCapacity;

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

        private static destinationIsHome(gameInfo: GameInfo) {
            return Index.destination.X === gameInfo.Player.HouseLocation.X && Index.destination.Y === gameInfo.Player.HouseLocation.Y;
        }

        private static destinationIsNotAMine(mines: Array<Tile>) {
            return mines.every((mine: Tile) => {
                return Index.destination.X !== mine.Position.X && Index.destination.Y !== mine.Position.Y;
            });
        }

        private static changePrice(): void {
            switch (Index.price) {
                case 15000:
                    Index.price = 50000;
                    break;
                case 50000:
                    Index.price = 100000;
                    break;
                case 100000:
                    Index.price = 250000;
                    break;
                case 250000:
                    Index.price = 500000;
                    break;
                case 500000:
                    Index.price = 15000;
                    Index.upgradeType = Index.upgradeType + 1;
                    break;
                default:
                    Index.price = 500000;
            }
        }

        private static getAction(map: Tile[][], gameInfo: GameInfo) {
            const home = gameInfo.Player.HouseLocation;
            const mines = Index.getMinerals(map);
            if (Index.destination !== undefined && !Index.destinationIsHome(gameInfo) && Index.destinationIsNotAMine(mines)) {
                Index.destination = home;
                return AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
            }

            const mineableMinerals = Index.getMineableMinerals(map, gameInfo);
            if (mineableMinerals.length > 0 && !Index.backPackIsFull(gameInfo)) {
                return AIHelper.createCollectAction(mineableMinerals[0]);
            } else if (Index.backPackIsFull(gameInfo)) {
                Index.destination = home;
                return AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
            } else {
                if (Index.destination === undefined || (gameInfo.Player.Position.X === home.X && gameInfo.Player.Position.Y === home.Y)) {
                    Index.destination = undefined;
                    if (gameInfo.Player.TotalResources >= Index.price) {
                        const action = AIHelper.createUpgradeAction(Index.upgradeType);
                        Index.changePrice();
                        return action;
                    }
                    Index.destination = Index.findOptimalPathMine(mines, map, gameInfo);
                    return AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
                } else {
                    return AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
                }
            }
        }

        private static getMineableMinerals (map: Tile[][], gameInfo: GameInfo): Array<Point> {
            const mineableMinerals = new Array();
            const mineralOnSight = Index.getMinerals(map);
            mineralOnSight.forEach((tile: Tile) => {
                if (tile.Position.Distance(gameInfo.Player.Position) <= 1) {
                    mineableMinerals.push(tile.Position);
                }
            });
            return mineableMinerals;
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
                    if (map[x][y].Content !== 0) {
                        line += map[x][y].Content + '  ';
                    } else {
                        line += '   ';
                    }
                }
                console.log(line);
            }
            let line = '   ';
            for (let x = 0; x < 20; x++) {
                line += map[x][0].Position.X + ' ';
            }
            console.log(line);
        }

        private static aStarToDestination(map: Tile[][], gameInfo: GameInfo) {
            let aStar = new aStarFinder(map, gameInfo);
             let goal = new Point(10 + (Index.destination.X - gameInfo.Player.Position.X), 10 + (Index.destination.Y - gameInfo.Player.Position.Y));
            let playerPosition = new Point(10, 10);
            let path = aStar.generatePath(playerPosition, goal);

            return new Point(path[1][0] - 10 + gameInfo.Player.Position.X, path[1][1] - 10 + gameInfo.Player.Position.Y);
        }

        private static findOptimalPathMine(mines:Array<Tile>, map:Tile[][], gameInfo: GameInfo): Point {
            let aStar = new aStarFinder(map, gameInfo);
            let bestMine: Point;
            let optimalLength: number = Infinity;
            let playerPosition: Point = new Point(10, 10);
            mines.forEach((mine) => {
                let minePosition: Point = new Point(10 + (mine.Position.X - gameInfo.Player.Position.X), 10 + (mine.Position.Y - gameInfo.Player.Position.Y));
                let path = aStar.generatePath(playerPosition, minePosition);
                if(path.length < optimalLength && path.length > 0) {
                    bestMine = mine.Position;
                    optimalLength = path.length;

                }
            });

            return bestMine;
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
