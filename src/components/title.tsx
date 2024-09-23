import React from 'react';
import { ColumnData } from './board';

export default function DealTitle({ columnData }: { columnData: ColumnData }) {
	return (
		<div className="text-3xl font-bold border p-3 rounded-lg">
			{columnData.title}
		</div>
	);
}
