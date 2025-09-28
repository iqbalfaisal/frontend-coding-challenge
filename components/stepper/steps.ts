import { common } from "../../i18n/strings";

export interface Step {
	title: string;
}

export const steps: Step[] = [
	{
		title: common.steps.service.label
	},
	{
		title: common.steps.deadline.label
	},
	{
		title: common.steps.vehicle.label
	},
	{
		title: common.steps.contact.label
	},
];
