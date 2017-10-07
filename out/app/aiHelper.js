"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("./interfaces");
class AIHelper {
    static createStealAction(position) {
        return AIHelper.createAction('StealAction', position);
    }
    static createAttackAction(position) {
        return AIHelper.createAction('AttackAction', position);
    }
    static createCollectAction(position) {
        return AIHelper.createAction('CollectAction', position);
    }
    static createMoveAction(newPosition) {
        return AIHelper.createAction('MoveAction', newPosition);
    }
    static createHealAction() {
        return JSON.stringify({ ActionName: "HealAction", Content: "" });
    }
    static createPurchaseAction(item) {
        let action;
        switch (item) {
            case interfaces_1.PurchasableItem.DevolutionsBackpack:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case interfaces_1.PurchasableItem.DevolutionsPickaxe:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case interfaces_1.PurchasableItem.HealthPotion:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case interfaces_1.PurchasableItem.MicrosoftSword:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case interfaces_1.PurchasableItem.UbisoftShield:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
        }
        return JSON.stringify(action);
    }
    static createUpgradeAction(upgrade) {
        let action;
        switch (upgrade) {
            case interfaces_1.UpgradeType.CollectingSpeed:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "CollectingSpeed" });
                break;
            case interfaces_1.UpgradeType.CarryingCapacity:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "CarryingCapacity" });
                break;
            case interfaces_1.UpgradeType.AttackPower:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "AttackPower" });
                break;
            case interfaces_1.UpgradeType.Defence:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "Defence" });
                break;
            case interfaces_1.UpgradeType.MaximumHealth:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "MaximumHealth" });
                break;
        }
        console.log(action);
        return action;
    }
    static createAction(name, target) {
        const action = {
            ActionName: name,
            Content: JSON.stringify(target)
        };
        return JSON.stringify(action);
    }
}
exports.AIHelper = AIHelper;
//# sourceMappingURL=aiHelper.js.map