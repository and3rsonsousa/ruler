import { isAfter, isBefore, isToday, parseISO } from "date-fns";
import { FINISHED_ID, POST_ID, VIDEO_ID } from "./constants";

export function ShortText({ text }: { text: string }) {
	const length = text.length;
	return (
		<div
			className={`font-bold tracking-widest uppercase text-center leading-none`}
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
