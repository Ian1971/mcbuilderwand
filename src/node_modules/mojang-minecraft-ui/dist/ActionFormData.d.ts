import type { ActionFormResponse } from './ActionFormResponse';
import {Player} from 'mojang-minecraft'
export declare class ActionFormData {
    title(titleText: string): ActionFormData
    body(bodyText: string): ActionFormData
    button(text: string, iconPath?: string): ActionFormData
    show(player: Player): Promise<ActionFormResponse>
}
