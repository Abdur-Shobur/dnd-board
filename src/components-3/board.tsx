'use client';

import { useState } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from '@hello-pangea/dnd';

import Column from './column';
import DealTitle from './title';

export interface Item {
	id: string;
	title: string;
}

export interface ColumnData {
	id: string;
	title: string;
	itemsOrder: string[]; // array of item ids
}

export interface ColumnProps {
	itemsOrder: string[];
	id: string;
	ITEMS: Record<string, Item>; // key-value pair of item id and item
}

interface BoardState {
	[key: string]: ColumnData;
}

const myCloumnData = [
	{
		id: 'column-1',
		title: 'my column 1',
		itemsOrder: ['item-1', 'item-2', 'item-3'],
	},
	{ id: 'column-2', title: 'my column 2', itemsOrder: ['item-4', 'item-5'] },
	{ id: 'column-3', title: 'my column 3', itemsOrder: ['item-6', 'item-7'] },
	{ id: 'column-4', title: 'my column 4', itemsOrder: [] },
];

const myItems = [
	{ id: 'item-1', title: 'item 1' },
	{ id: 'item-2', title: 'item 2' },
	{ id: 'item-3', title: 'item 3' },
	{ id: 'item-4', title: 'item 4' },
	{ id: 'item-5', title: 'item 5' },
	{ id: 'item-6', title: 'item 6' },
	{ id: 'item-7', title: 'item 7' },
	{ id: 'item-8', title: 'item 8' },
];

// Transform myCloumnData into BoardState format
const myBoardState: BoardState = myCloumnData.reduce((acc, column) => {
	acc[column.id] = {
		id: column.id, // Keeping the prefix for column IDs
		title: column.title,
		itemsOrder: column.itemsOrder.map((itemId) => itemId), // Keeping the prefix for item IDs
	};
	return acc;
}, {} as BoardState); // Type assertion to BoardState

// Transform myItems into ITEMS format
const myItemsRecord: Record<string, Item> = myItems.reduce((acc, item) => {
	acc[item.id] = {
		// Keeping the prefix for item records
		id: item.id,
		title: item.title,
	};
	return acc;
}, {} as Record<string, Item>); // Type assertion

export default function BoardMain2() {
	const [columnsOrder, setColumnsOrder] = useState<string[]>([
		'column-1',
		'column-2',
		'column-3',
		'column-4',
	]);
	const [data, setData] = useState<BoardState>(myBoardState);

	// preview state
	const [preview, setPreview] = useState<any>({ data: null, api: null });

	const handleDragDrop = async (result: DropResult) => {
		const { source, destination, type } = result;

		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		)
			return;

		const sourceIndex = source.index;
		const destinationIndex = destination.index;

		// eslint-disable-next-line prefer-const
		let updatedData = { ...data };

		if (type === 'COLUMN') {
			const reorderedColumns = [...columnsOrder];
			const [removedItem] = reorderedColumns.splice(sourceIndex, 1);
			reorderedColumns.splice(destinationIndex, 0, removedItem);

			setColumnsOrder(reorderedColumns);

			// preview
			setPreview({ data: reorderedColumns, api: '/api/save-columns' });

			// Update backend with new column order
			await fetch('/api/save-columns', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reorderedColumns),
			});

			return;
		}

		const sourceColumn = updatedData[source.droppableId];
		const destinationColumn = updatedData[destination.droppableId];

		if (source.droppableId === destination.droppableId) {
			const newItemsOrder = [...sourceColumn.itemsOrder];
			const [movedItem] = newItemsOrder.splice(sourceIndex, 1);
			newItemsOrder.splice(destinationIndex, 0, movedItem);

			updatedData[source.droppableId] = {
				...sourceColumn,
				itemsOrder: newItemsOrder,
			};
			setData(updatedData);

			// preview
			setPreview({
				data: updatedData[source.droppableId],
				api: `/api/save-column/${source.droppableId}`,
			});

			// Update backend with new item order in the same column
			await fetch(`/api/save-column/${source.droppableId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					source: updatedData[source.droppableId],
					destination: null,
				}),
			});
		} else {
			const newSourceItems = [...sourceColumn.itemsOrder];
			const [movedItem] = newSourceItems.splice(sourceIndex, 1);
			const newDestinationItems = [...destinationColumn.itemsOrder];
			newDestinationItems.splice(destinationIndex, 0, movedItem);

			updatedData[source.droppableId] = {
				...sourceColumn,
				itemsOrder: newSourceItems,
			};
			updatedData[destination.droppableId] = {
				...destinationColumn,
				itemsOrder: newDestinationItems,
			};

			setData(updatedData);

			// preview
			setPreview({
				data: {
					source: updatedData[source.droppableId],
					destination: updatedData[destination.droppableId],
				},
				api: `from:->/api/save-column/${source.droppableId} || to->/api/save-column/${destination.droppableId}`,
			});
			// Update backend with new item order for both columns
			await Promise.all([
				fetch(`/api/save-column/${source.droppableId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						source: updatedData[source.droppableId],
						destination: updatedData[destination.droppableId],
					}),
				}),
			]);
		}
	};

	return (
		<div className="w-full">
			<div
				style={{
					userSelect: 'none',
				}}
			>
				<DragDropContext onDragEnd={handleDragDrop}>
					<Droppable droppableId="ROOT" type="COLUMN" direction="horizontal">
						{(provided) => (
							<div
								className="flex w-full min-h-96 rounded-md overflow-x-scroll md:overflow-hidden"
								{...provided.droppableProps}
								ref={provided.innerRef}
							>
								{columnsOrder.map((colId, index) => {
									const columnData = data[colId];
									return (
										<Draggable
											draggableId={columnData.id}
											key={columnData.id}
											index={index}
										>
											{(provided) => (
												<div
													className="min-w-64 border border-skin-color-1 rounded-xl shadow p-3 flex flex-col max-w-xs m-3"
													ref={provided.innerRef}
													{...provided.draggableProps}
												>
													<div {...provided.dragHandleProps}>
														<DealTitle columnData={columnData} />
													</div>
													<Column {...columnData} ITEMS={myItemsRecord} />
												</div>
											)}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
			{/* Preview Section */}
			<div className="flex flex-wrap">
				<div
					style={{
						width: '350px',
						maxHeight: '500px',
						overflow: 'auto',
						marginLeft: '50px',
						padding: '20px',
					}}
					className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg  "
				>
					<h2 className="text-lg font-bold">Preview API Submission</h2>
					<p className="mt-2">
						<strong>API:</strong> {preview.api}
					</p>
					<div className="mt-2">
						<strong>Data:</strong>
						<pre className="  p-2 rounded-md overflow-x-auto">
							{JSON.stringify(preview.data, null, 2)}
						</pre>
					</div>
				</div>
				<div
					style={{
						width: '350px',
						maxHeight: '500px',
						overflow: 'auto',
						marginLeft: '50px',
						padding: '20px',
					}}
					className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg  "
				>
					<h2 className="text-lg font-bold">Initial Data</h2>

					<div className="mt-2">
						<strong>Columns:</strong>
						<pre className="  p-2 rounded-md overflow-x-auto">
							{JSON.stringify(columnsOrder, null, 2)}
						</pre>
					</div>
				</div>
				<div
					style={{
						width: '350px',
						maxHeight: '500px',
						overflow: 'auto',
						marginLeft: '50px',
						padding: '20px',
					}}
					className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg  "
				>
					<h2 className="text-lg font-bold">Initial Data</h2>

					<div className="mt-2">
						<strong>myCloumnData:</strong>
						<pre className="  p-2 rounded-md overflow-x-auto">
							{JSON.stringify(myCloumnData, null, 2)}
						</pre>
					</div>
				</div>
				<div
					style={{
						width: '350px',
						maxHeight: '500px',
						overflow: 'auto',
						marginLeft: '50px',
						padding: '20px',
					}}
					className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg  "
				>
					<h2 className="text-lg font-bold">Initial Data</h2>

					<div className="mt-2">
						<strong>myItems:</strong>
						<pre className="  p-2 rounded-md overflow-x-auto">
							{JSON.stringify(myItems, null, 2)}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
