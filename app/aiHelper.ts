import { Point, UpgradeType, PurchasableItem } from './interfaces';

export class AIHelper {

    public static createStealAction(position: Point): string {
        return AIHelper.createAction('StealAction', position);
    }

    public static createAttackAction(position: Point): string {
        return AIHelper.createAction('AttackAction', position);
    }

    public static createCollectAction(position: Point): string {
        return AIHelper.createAction('CollectAction', position);
    }

    public static createMoveAction(newPosition: Point): string {
        return AIHelper.createAction('MoveAction', newPosition);
    }

    public static createHealAction(): string {
        return JSON.stringify({ ActionName: "HealAction", Content: "" });
    }

    public static createPurchaseAction(item: PurchasableItem): string {
        let action;
        switch (item) {
            case PurchasableItem.DevolutionsBackpack:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case PurchasableItem.DevolutionsPickaxe:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case PurchasableItem.HealthPotion:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case PurchasableItem.MicrosoftSword:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
            case PurchasableItem.UbisoftShield:
                action = { ActionName: "PurchaseAction", Content: "DevolutionsBackpack" };
                break;
        }
        return JSON.stringify(action);
    }

    public static createUpgradeAction(upgrade: UpgradeType): string {
        let action: string;
        switch (upgrade) {
            case UpgradeType.CollectingSpeed:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "CollectingSpeed" });
                break;
            case UpgradeType.CarryingCapacity:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "CarryingCapacity" });
                break;
            case UpgradeType.AttackPower:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "AttackPower" });
                break;
            case UpgradeType.Defence:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "Defence" });
                break;
            case UpgradeType.MaximumHealth:
                action = JSON.stringify({ ActionName: "UpgradeAction", Content: "MaximumHealth" });
                break;
        }
        console.log(action);
        return action;
    }

    private static createAction(name: string, target: Point): string {
        const action = {
            ActionName: name,
            Content: JSON.stringify(target)
        };

        return JSON.stringify(action);
    }
}