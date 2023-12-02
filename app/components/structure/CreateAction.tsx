import { PopoverTrigger } from "@radix-ui/react-popover";
import { Popover, PopoverContent } from "../ui/ui/popover";
import { Button } from "../ui/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/ui/input";
import { Form } from "@remix-run/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/ui/select";

export default function CreateAction() {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="default"
					size="icon"
					className="fixed bottom-2 right-2 rounded-full"
				>
					<PlusIcon className="w-8" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="bg-content px-8 w-[90dvw] mr-2 sm:w-96">
				<Form method="post">
					<div
						contentEditable="true"
						className="bg-transparent w-full text-gray-400 font-medium text-2xl focus:text-gray-300 outline-none"
					>
						Título da ação
					</div>
					<div
						contentEditable="true"
						className="bg-transparent w-full text-gray-400 font-light text-sm focus:text-gray-300 outline-none"
					>
						Lorem ipsum dolor sit, amet consectetur adipisicing
						elit. Eaque cumque dolor incidunt vero non aut.
					</div>
					<hr className="border-gray-300/20 my-4" />
					<div className="flex justify-between gap-2">
						<div className="flex items-center gap-1">
							<Select defaultValue="1">
								<SelectTrigger>
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">1</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</Form>
			</PopoverContent>
		</Popover>
	);
}
