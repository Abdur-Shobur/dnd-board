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
	{ id: '1', title: 'my column 1', itemsOrder: ['1', '2', '3'] },
	{ id: '2', title: 'my column 2', itemsOrder: ['4', '5'] },
	{ id: '3', title: 'my column 3', itemsOrder: ['6', '7'] },
];

const myItems = [
	{ id: '1', title: 'item 1' },
	{ id: '2', title: 'item 2' },
	{ id: '3', title: 'item 3' },
	{ id: '4', title: 'item 4' },
	{ id: '5', title: 'item 5' },
	{ id: '6', title: 'item 6' },
	{ id: '7', title: 'item 7' },
];

// Transform myCloumnData into BoardState format
const myBoardState: BoardState = myCloumnData.reduce((acc, column) => {
	acc[`column-${column.id}`] = {
		id: `column-${column.id}`,
		title: column.title,
		itemsOrder: column.itemsOrder.map((itemId) => `item-${itemId}`),
	};
	return acc;
}, {});

// Transform myItems into ITEMS format
const myItemsRecord: Record<string, Item> = myItems.reduce((acc, item) => {
	acc[`item-${item.id}`] = {
		id: `item-${item.id}`,
		title: item.title,
	};
	return acc;
}, {});

export default function BoardMain2() {
	const [columnsOrder, setColumnsOrder] = useState<string[]>([
		'column-1',
		'column-2',
		'column-3',
	]);
	const [data, setData] = useState<BoardState>(myBoardState);

	const handleDragDrop = (result: DropResult) => {
		const { source, destination, type } = result;

		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		)
			return;

		const sourceIndex = source.index;
		const destinationIndex = destination.index;

		if (type === 'COLUMN') {
			const reorderedColumns = [...columnsOrder];
			const [removedItem] = reorderedColumns.splice(sourceIndex, 1);
			reorderedColumns.splice(destinationIndex, 0, removedItem);

			setColumnsOrder(reorderedColumns);
			return;
		}

		const sourceColumn = data[source.droppableId];
		const destinationColumn = data[destination.droppableId];

		if (source.droppableId === destination.droppableId) {
			const newItemsOrder = [...sourceColumn.itemsOrder];
			const [movedItem] = newItemsOrder.splice(sourceIndex, 1);
			newItemsOrder.splice(destinationIndex, 0, movedItem);

			setData({
				...data,
				[source.droppableId]: {
					...sourceColumn,
					itemsOrder: newItemsOrder,
				},
			});
		} else {
			const newSourceItems = [...sourceColumn.itemsOrder];
			const [movedItem] = newSourceItems.splice(sourceIndex, 1);
			const newDestinationItems = [...destinationColumn.itemsOrder];
			newDestinationItems.splice(destinationIndex, 0, movedItem);

			setData({
				...data,
				[source.droppableId]: { ...sourceColumn, itemsOrder: newSourceItems },
				[destination.droppableId]: {
					...destinationColumn,
					itemsOrder: newDestinationItems,
				},
			});
		}
	};

	return (
		<div className="w-full">
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
	);
}
