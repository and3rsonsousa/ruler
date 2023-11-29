import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@vercel/remix";
import { AlertCircleIcon } from "lucide-react";
import MyTextField from "~/components/forms/TextField";
import Logo from "~/components/structure/Logo";
import { Button } from "~/components/ui/ui/button";
import createServerClient from "~/lib/supabase";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export async function action({ request }: ActionFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const { email, password } = Object.fromEntries(await request.formData());

	const { error } = await supabase.auth.signInWithPassword({
		email: email as string,
		password: password as string,
	});

	if (error) {
		return json({ error }, { headers });
	}
	return redirect("/dashboard", { headers });
}

export default function Index() {
	const data = useActionData<typeof action>();
	return (
		<div className="h-[100dvh] grid place-content-center">
			<div className="container mx-auto w-full p-8 relative">
				<div>
					<Logo size="sm" />

					<Form method="post" className="w-60 mt-8">
						<MyTextField
							label="E-mail"
							name="email"
							placeholder="Seu email"
						/>
						<MyTextField
							label="Senha"
							name="password"
							type="password"
							placeholder="Sua senha"
						/>

						<div className="text-right mt-8">
							<Button type="submit">Entrar</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}
