export interface Map {
    Tiles: Tile[][];
}

export interface Tile {
    Content: TileContent;
    Position: Point;
}

export interface GameInfo {
    Player: IPlayer;
    CustomSerializedMap: string;
    OtherPlayers: IPlayer[];
}

export interface IPlayer {
    Name: string;
    AttackPower: number;
    CarriedResources: number;
    CarryingCapacity: number;
    Defence: number;
    Health: number;
    MaxHealth: number;
    Score: number;
    TotalResources: number;
    Position: Point;
    HouseLocation: Point;
}

export class Point {
    public X: number;
    public Y: number;

    public constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public Distance(other: Point): number {
        const xDist = other.X - this.X;
        const yDist = other.Y - this.Y;
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
}

export enum TileContent {
    Empty,
    Wall,
    House,
    Lava,
    Resource,
    Shop,
    Player
}

export enum UpgradeType {
    CarryingCapacity,
    AttackPower,
    Defence,
    MaximumHealth,
    CollectingSpeed
}

export enum PurchasableItem {
    MicrosoftSword,
    UbisoftShield,
    DevolutionsBackpack,
    DevolutionsPickaxe,
    HealthPotion,
}
