import { useMatches } from "@remix-run/react";
import { useEffect, useRef } from "react";

export function CircleProgressItem({
	value = 50,
	classNames = "",
	rotate = 0,
}: {
	value?: number;
	classNames?: string;
	rotate?: number;
}) {
	const circle = useRef<SVGCircleElement>(null);
	const circumference = (circle.current?.r.baseVal.value || 0) * Math.PI * 2;

	return (
		<svg width={48} height={48} className={`absolute inset-0`}>
			<circle
				className={`${classNames} origin-center`}
				ref={circle}
				r={23}
				cx={24}
				cy={24}
				fill="none"
				strokeWidth={2}
				strokeDasharray={circumference}
				strokeDashoffset={circumference - (value / 100) * circumference}
				style={{ transform: `rotate(${rotate}deg)` }}
			/>
		</svg>
	);
}

export function CircleProgress({ actions }: { actions: Action[] | null }) {
	const matches = useMatches();
	const { states } = matches[1].data as DashboardDataType;
	const total = actions?.length || 1;
	let rotate = 0;
	return actions ? (
		<div className="absolute inset-0 -rotate-90 ">
			{states.map((state, i) => {
				const pct = parseFloat(
					(
						(actions.filter(
							(action) => action.state_id === state.id
						).length /
							total) *
						100
					).toFixed(1)
				);
				rotate = i > 0 ? ((100 - pct) * 360) / 100 + rotate : 0;
				return (
					<CircleProgressItem
						value={pct}
						rotate={rotate}
						classNames={`stroke-${state.slug}`}
						key={i}
					/>
				);
			})}
		</div>
	) : null;
}
