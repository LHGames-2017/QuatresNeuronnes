import * as express from 'express';
import { GameInfo, Tile, Point } from '../interfaces';
import { AIHelper } from '../aiHelper';

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

        private static getAction(map: Tile[][], gameInfo: GameInfo) {

        }

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            const mapData = JSON.parse(req.body.map) as GameInfo;
            const map = Index.decompressMap(mapData.CustomSerializedMap);

            let action = Index.getAction(map, mapData);
            res.send(action);
        }

        public ping(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.json({ success: true, test: false });
        }
    }
}

export = Route;
