export default function Logo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
	return (
		<img
			src="/logo.svg"
			alt="Canivete"
			className={size === "sm" ? "h-4" : size === "md" ? "h-8" : "h-12"}
		/>
	);
	// return size === "sm" ? (
	// 	<h1 className="font-semibold text-3xl tracking-tight  mb-2">ʀᴜʟeʀ</h1>
	// ) : (
	// 	<h1 className="font-bold text-[6vw] tracking-tighter  mb-2">ʀᴜʟeʀ</h1>
	// );
}
