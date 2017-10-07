"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
    Distance(other) {
        const xDist = other.X - this.X;
        const yDist = other.Y - this.Y;
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
}
exports.Point = Point;
var TileContent;
(function (TileContent) {
    TileContent[TileContent["Empty"] = 0] = "Empty";
    TileContent[TileContent["Wall"] = 1] = "Wall";
    TileContent[TileContent["House"] = 2] = "House";
    TileContent[TileContent["Lava"] = 3] = "Lava";
    TileContent[TileContent["Resource"] = 4] = "Resource";
    TileContent[TileContent["Shop"] = 5] = "Shop";
    TileContent[TileContent["Player"] = 6] = "Player";
})(TileContent = exports.TileContent || (exports.TileContent = {}));
var UpgradeType;
(function (UpgradeType) {
    UpgradeType[UpgradeType["CarryingCapacity"] = 0] = "CarryingCapacity";
    UpgradeType[UpgradeType["AttackPower"] = 1] = "AttackPower";
    UpgradeType[UpgradeType["Defence"] = 2] = "Defence";
    UpgradeType[UpgradeType["MaximumHealth"] = 3] = "MaximumHealth";
    UpgradeType[UpgradeType["CollectingSpeed"] = 4] = "CollectingSpeed";
})(UpgradeType = exports.UpgradeType || (exports.UpgradeType = {}));
var PurchasableItem;
(function (PurchasableItem) {
    PurchasableItem[PurchasableItem["MicrosoftSword"] = 0] = "MicrosoftSword";
    PurchasableItem[PurchasableItem["UbisoftShield"] = 1] = "UbisoftShield";
    PurchasableItem[PurchasableItem["DevolutionsBackpack"] = 2] = "DevolutionsBackpack";
    PurchasableItem[PurchasableItem["DevolutionsPickaxe"] = 3] = "DevolutionsPickaxe";
    PurchasableItem[PurchasableItem["HealthPotion"] = 4] = "HealthPotion";
})(PurchasableItem = exports.PurchasableItem || (exports.PurchasableItem = {}));
//# sourceMappingURL=interfaces.js.map