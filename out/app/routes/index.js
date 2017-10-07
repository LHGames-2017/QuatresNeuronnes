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
        static getAction(map, gameInfo) {
            console.log(this.findOptimalPathMine(this.getMinerals(map), map, gameInfo));
        }
        static getMineableMinerals(map, gameInfo) {
            let mineableMinerals = new Array();
            let mineralOnSight = Index.getMinerals(map);
            mineralOnSight.forEach((tile) => {
                if (tile.Position.Distance(gameInfo.Player.Position) <= 1) {
                    mineableMinerals.push(tile.Position);
                }
            });
            return mineableMinerals;
        }
        static moveTo(position) {
            return aiHelper_1.AIHelper.createMoveAction(position);
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
        static findOptimalPathMine(mines, map, gameInfo) {
            let aStar = new astar_1.aStarFinder(map, gameInfo);
            let bestPath;
            let optimalLength = Infinity;
            let playerPosition = new interfaces_1.Point(10, 10);
            mines.forEach((mine) => {
                let minePosition = new interfaces_1.Point(10 + (mine.Position.X - gameInfo.Player.Position.X), 10 + (mine.Position.Y - gameInfo.Player.Position.Y));
                let path = aStar.generatePath(playerPosition, minePosition);
                if (path.length < optimalLength && path.length > 0) {
                    optimalLength = path.length;
                    let pointArray = [];
                    path.forEach((position) => {
                        let point = new interfaces_1.Point(position[0], position[1]);
                        pointArray.push(point);
                    });
                    bestPath = pointArray;
                }
            });
            return bestPath;
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
    Route.Index = Index;
})(Route || (Route = {}));
module.exports = Route;
//# sourceMappingURL=index.js.map