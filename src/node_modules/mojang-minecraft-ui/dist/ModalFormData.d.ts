import { ModalFormResponse } from './ModalFormResponse';
import {Player} from 'mojang-minecraft'
export declare class ModalFormData {
    title(titleText: string): ModalFormData
    textField(label: string, placeholderText: string, defaultValue?: string): ModalFormData
    dropdown(label: string, options: string[], defaultValueIndex?: number): ModalFormData
    slider(label: string, minimumValue: number, maximumValue: number, valueStep: number, defaultValue?: number): ModalFormData
    toggle(label: string, defaultValue?: boolean): ModalFormData
    icon(iconPath: string): ModalFormData
    show(player: Player): Promise<ModalFormResponse>
}
