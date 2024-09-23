import React from 'react';
import { Item } from './board';

export default function DealCardItem({ item }: { item: Item }) {
	return (
		<div className="mb-3 border p-2 rounded select-none">{item.title}</div>
	);
}
