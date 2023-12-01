import { ActionFunctionArgs } from "@vercel/remix";
import createServerClient from "~/lib/supabase";

export const action = async ({ request }: ActionFunctionArgs) => {
	const [headers, supabase] = createServerClient(request);

	const formData = await request.formData();
	let { action, id, ...values } = Object.fromEntries(formData.entries());

	console.log(values);

	if (action === "action-update") {
		const data = await supabase
			.from("actions")
			.update({ ...values })
			.eq("id", id);
	}

	return {};
};
