"use client";
import { useLayoutEffect, useState } from "react";
import { toLocalString } from "../utils/date";

export function Timestamp({
	timestamp,
	todayText = "Today",
}: { timestamp: Date | string; todayText?: string }): React.ReactNode {
	const [str, setStr] = useState("");

	useLayoutEffect(() => {
		const localString = toLocalString(new Date(timestamp));
		setStr(localString.replace("Today", todayText));
	}, [timestamp]);

	return str;
}
