import { LockIcon, UnlockIcon } from "lucide-react";
import { useState } from "react";
import { Input, InputProps } from "../ui/ui/input";
import { FormItem } from "../ui/ui/form";
import { Label } from "@radix-ui/react-label";
import { Toggle } from "../ui/ui/toggle";

interface MyTextFieldProps extends InputProps {
	label?: string;
	description?: string;
	errorMessage?: string;
	type?: string;
	placeholder?: string;
}

export default function MyTextField({
	label,
	description,
	errorMessage,
	placeholder,
	type = "text",
	...props
}: MyTextFieldProps) {
	const [show, setShow] = useState(type !== "password");

	return (
		<FormItem className="form-control">
			<Label className="label">{label}</Label>
			{type === "password" ? (
				<div className="flex gap-2 w-full">
					<Input
						type={show ? "text" : "password"}
						className="input input-bordered w-full join-item placeholder-gray-500"
						placeholder={placeholder}
						{...props}
					/>
					<Toggle onPressedChange={() => setShow(!show)}>
						{show ? (
							<UnlockIcon className="w-4 swap-on" />
						) : (
							<LockIcon className="w-4 swap-off" />
						)}
					</Toggle>
				</div>
			) : (
				<Input type={type} placeholder={placeholder} {...props} />
			)}
			{description && <div slot="description">{description}</div>}
			<div>{errorMessage}</div>
		</FormItem>
	);
}
