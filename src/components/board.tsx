'use client';

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

import { useState } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from 'react-beautiful-dnd';
import Column from './column';
import DealTitle from './title';

const INITIAL_COLUMN_ORDER = ['column-1', 'column-2', 'column-3'];

const INITIAL_COL_DATA: BoardState = {
	'column-1': {
		id: 'column-1',
		title: 'Column 1',
		itemsOrder: ['item-1', 'item-2', 'item-3'],
	},
	'column-2': {
		id: 'column-2',
		title: 'Column 2',
		itemsOrder: ['item-4', 'item-5'],
	},
	'column-3': {
		id: 'column-3',
		title: 'Column 3',
		itemsOrder: ['item-6', 'item-7', 'item-8'],
	},
};

const ITEMS: Record<string, Item> = {
	'item-1': { id: 'item-1', title: 'Item 1' },
	'item-2': { id: 'item-2', title: 'Item 2' },
	'item-3': { id: 'item-3', title: 'Item 3' },
	'item-4': { id: 'item-4', title: 'Item 4' },
	'item-5': { id: 'item-5', title: 'Item 5' },
	'item-6': { id: 'item-6', title: 'Item 6' },
	'item-7': { id: 'item-7', title: 'Item 7' },
	'item-8': { id: 'item-8', title: 'Item 8' },
};

export default function BoardMain() {
	const [columnsOrder, setColumnsOrder] =
		useState<string[]>(INITIAL_COLUMN_ORDER);
	const [data, setData] = useState<BoardState>(INITIAL_COL_DATA);

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
		<div className=" w-full ">
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
													{/* head  */}
													<DealTitle columnData={columnData} />
												</div>

												<Column {...columnData} ITEMS={ITEMS} />
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
