"use strict";
const interfaces_1 = require("../interfaces");
const aiHelper_1 = require("../aiHelper");
const astar_1 = require("./../astar");
var Route;
(function (Route) {
    class Index {
        static decompressMap(compressedMap) {
            const map = new Array();
            compressedMap = compressedMap.substring(2, compressedMap.length - 3);
            const row = compressedMap.split('],[');
            for (let i = 0; i < row.length; i++) {
                map[i] = new Array();
                const column = row[i].split('{');
                for (let j = 0; j < column.length - 1; j++) {
                    map[i][j] = {
                        Content: +(column[j + 1].split(',')[0]),
                        Position: new interfaces_1.Point(column[j + 1].split(',')[1], column[j + 1].split(',')[2].substring(0, column[j + 1].split(',')[2].length - 1))
                    };
                }
            }
            return map;
        }
        static backPackIsFull(gameInfo) {
            if (gameInfo.Player.CarriedResources >= gameInfo.Player.CarryingCapacity) {
                return true;
            }
            return false;
        }
        static destinationIsHome(gameInfo) {
            return Index.destination.X === gameInfo.Player.HouseLocation.X && Index.destination.Y === gameInfo.Player.HouseLocation.Y;
        }
        static destinationIsNotAMine(mines) {
            return mines.every((mine) => {
                return Index.destination.X !== mine.Position.X && Index.destination.Y !== mine.Position.Y;
            });
        }
        static changePrice() {
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
        static getAction(map, gameInfo) {
            const home = gameInfo.Player.HouseLocation;
            const mines = Index.getMinerals(map);
            if (Index.destination !== undefined && !Index.destinationIsHome(gameInfo) && Index.destinationIsNotAMine(mines)) {
                Index.destination = home;
                return aiHelper_1.AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
            }
            const mineableMinerals = Index.getMineableMinerals(map, gameInfo);
            if (mineableMinerals.length > 0 && !Index.backPackIsFull(gameInfo)) {
                console.log('Mining');
                console.log(gameInfo.Player.CarriedResources);
                return aiHelper_1.AIHelper.createCollectAction(mineableMinerals[0]);
            }
            else if (Index.backPackIsFull(gameInfo)) {
                Index.destination = home;
                return aiHelper_1.AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
            }
            else {
                if (Index.destination === undefined || (gameInfo.Player.Position.X === home.X && gameInfo.Player.Position.Y === home.Y)) {
                    Index.destination = undefined;
                    if (gameInfo.Player.TotalResources >= Index.price) {
                        const action = aiHelper_1.AIHelper.createUpgradeAction(Index.upgradeType);
                        Index.changePrice();
                        return action;
                    }
                    console.log('finding next mine');
                    Index.destination = Index.findOptimalPathMine(mines, map, gameInfo);
                    console.log(Index.destination);
                    return aiHelper_1.AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
                }
                else {
                    return aiHelper_1.AIHelper.createMoveAction(Index.aStarToDestination(map, gameInfo));
                }
            }
        }
        static getMineableMinerals(map, gameInfo) {
            const mineableMinerals = new Array();
            const mineralOnSight = Index.getMinerals(map);
            mineralOnSight.forEach((tile) => {
                if (tile.Position.Distance(gameInfo.Player.Position) <= 1) {
                    mineableMinerals.push(tile.Position);
                }
            });
            return mineableMinerals;
        }
        static getMinerals(map) {
            const minerals = new Array();
            map.forEach((line) => {
                line.forEach((tile) => {
                    if (tile.Content === 4) {
                        minerals.push(tile);
                    }
                });
            });
            return minerals;
        }
        static printMap(map) {
            for (let y = 19; y >= 0; y--) {
                let line = '';
                line += map[0][y].Position.Y + ' ';
                if (map[0][y].Position.Y < 10) {
                    line += ' ';
                }
                for (let x = 0; x < 20; x++) {
                    if (map[x][y].Content !== 0) {
                        line += map[x][y].Content + '  ';
                    }
                    else {
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
        static aStarToDestination(map, gameInfo) {
            let aStar = new astar_1.aStarFinder(map, gameInfo);
            let goal = new interfaces_1.Point(10 + (Index.destination.X - gameInfo.Player.Position.X), 10 + (Index.destination.Y - gameInfo.Player.Position.Y));
            let playerPosition = new interfaces_1.Point(10, 10);
            let path = aStar.generatePath(playerPosition, goal);
            return new interfaces_1.Point(path[1][0] - 10 + gameInfo.Player.Position.X, path[1][1] - 10 + gameInfo.Player.Position.Y);
        }
        static findOptimalPathMine(mines, map, gameInfo) {
            let aStar = new astar_1.aStarFinder(map, gameInfo);
            let bestMine;
            let optimalLength = Infinity;
            let playerPosition = new interfaces_1.Point(10, 10);
            mines.forEach((mine) => {
                let minePosition = new interfaces_1.Point(10 + (mine.Position.X - gameInfo.Player.Position.X), 10 + (mine.Position.Y - gameInfo.Player.Position.Y));
                let path = aStar.generatePath(playerPosition, minePosition);
                if (path.length < optimalLength && path.length > 0) {
                    bestMine = mine.Position;
                    optimalLength = path.length;
                }
            });
            return bestMine;
        }
        index(req, res, next) {
            const mapData = JSON.parse(req.body.map);
            const map = Index.decompressMap(mapData.CustomSerializedMap);
            Index.printMap(map);
            let action = Index.getAction(map, mapData);
            res.send(action);
        }
        ping(req, res, next) {
            res.json({ success: true, test: false });
        }
    }
    Index.price = 15000;
    Index.upgradeType = interfaces_1.UpgradeType.CarryingCapacity;
    Route.Index = Index;
})(Route || (Route = {}));
module.exports = Route;
//# sourceMappingURL=index.js.map