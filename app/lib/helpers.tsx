import { isAfter, isBefore, isToday, parseISO } from "date-fns";
import { FINISHED_ID, POST_ID, VIDEO_ID } from "./constants";
import {
	LucideIcon,
	ImageIcon,
	PlayIcon,
	CircleDashedIcon,
	ListChecksIcon,
	DollarSignIcon,
	PrinterIcon,
	UsersIcon,
	Code2Icon,
	PenToolIcon,
	MegaphoneIcon,
	SignalLowIcon,
	SignalMediumIcon,
	SignalIcon,
	XIcon,
} from "lucide-react";
import { cn } from "./util";

export function ShortText({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const length = text.length;
	return (
		<div
			className={cn(
				`font-bold tracking-widest uppercase text-center leading-none`,
				className
			)}
		>
			{length > 4 ? (
				<div className=" scale-[0.65]">
					<div> {text.substring(0, Math.ceil(length / 2))} </div>
					<div> {text.substring(Math.ceil(length / 2))} </div>
				</div>
			) : length === 4 ? (
				<div className=" scale-[0.75]">
					<div> {text.substring(0, Math.ceil(length / 2))} </div>
					<div> {text.substring(Math.ceil(length / 2))} </div>
				</div>
			) : (
				<div className=" scale-[0.75]">{text}</div>
			)}
		</div>
	);
}

export function getLateActions(actions: Action[] | null) {
	return actions?.filter(
		(action) =>
			isBefore(parseISO(action.date), new Date()) &&
			action.state_id !== FINISHED_ID
	);
}

export function getNotFinishedActions(actions: Action[] | null) {
	return actions?.filter(
		(action) =>
			isAfter(parseISO(action.date), new Date()) &&
			action.state_id !== FINISHED_ID
	);
}

export function getTodayActions(actions: Action[] | null, finished?: boolean) {
	return actions?.filter(
		(action) =>
			isToday(parseISO(action.date)) &&
			(finished || action.state_id !== FINISHED_ID)
	);
}

export function getInstagramActions(actions: Action[] | null) {
	return actions?.filter((action) =>
		[POST_ID, VIDEO_ID].includes(Number(action.category_id))
	);
}

const categoryIconsList: { [key: string]: LucideIcon } = {
	post: ImageIcon,
	video: PlayIcon,
	stories: CircleDashedIcon,
	todo: ListChecksIcon,
	finance: DollarSignIcon,
	print: PrinterIcon,
	meeting: UsersIcon,
	dev: Code2Icon,
	design: PenToolIcon,
	ads: MegaphoneIcon,
};

const priorityIconsList: { [key: string]: LucideIcon } = {
	low: SignalLowIcon,
	mid: SignalMediumIcon,
	high: SignalIcon,
	base: SignalIcon,
};

export const CategoryIcons = ({
	id,
	className,
}: {
	id?: string;
	className?: string;
}) => {
	const View = categoryIconsList[id as string] ?? XIcon;

	return <View className={cn(className)} />;
};

export const PriorityIcons = ({
	id,
	className,
}: {
	id?: string;
	className?: string;
}) => {
	const View = priorityIconsList[id as string] ?? SignalIcon;

	return (
		<div className="relative">
			<SignalIcon
				className={cn([
					"absolute left-0 top-0 z-0 opacity-20",
					className,
				])}
			/>
			<View
				className={cn([
					"isolate",
					id === "low"
						? "text-green-400"
						: id === "mid"
						? "text-amber-500"
						: "text-rose-600",
					className,
				])}
			/>
		</div>
	);
};
