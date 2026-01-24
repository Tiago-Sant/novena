'use client';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function Calendar({
	selectedDays = [],
	onDayClick,
}: {
	selectedDays?: Date[];
	onDayClick?: (d: Date) => void;
}) {
	return (
		<div>
			<DayPicker
				mode="single"
				selected={selectedDays[0]}
				onDayClick={onDayClick}
			/>
		</div>
	);
}
