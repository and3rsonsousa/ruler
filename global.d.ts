import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database";

declare global {
	type OutletContextType = {
		supabase: SupabaseClient;
	};

	type Client = Database["public"]["Tables"]["clients"]["Row"];
	type Person = Database["public"]["Tables"]["people"]["Row"];
	type People = Person[];
	type Category = Database["public"]["Tables"]["categories"]["Row"];
	type State = Database["public"]["Tables"]["states"]["Row"];
	type Action = Database["public"]["Tables"]["actions"]["Row"];

	type DashboardDataType = {
		clients: Client[];
		people: People;
		categories: Category[];
		states: State[];
	};
}
