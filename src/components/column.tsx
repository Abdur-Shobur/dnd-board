import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ColumnProps } from './board';
import DealCardItem from './item';

const Column: React.FC<ColumnProps> = ({ itemsOrder, id, ITEMS }) => {
	console.log({ itemsOrder, id, ITEMS });
	return (
		<Droppable droppableId={id}>
			{(provided) => (
				<div
					className="min-h-full"
					{...provided.droppableProps}
					ref={provided.innerRef}
				>
					{itemsOrder.map((item_id, index) => {
						const item = ITEMS[item_id];

						return (
							<Draggable draggableId={item.id} index={index} key={item.id}>
								{(provided) => (
									<div
										{...provided.dragHandleProps}
										{...provided.draggableProps}
										ref={provided.innerRef}
										className="mb-3"
									>
										<DealCardItem item={item} />
									</div>
								)}
							</Draggable>
						);
					})}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default Column;

const myCloumnData = [
	{
		id: '1',
		title: 'my column 1',
		itemsOrder: ['1', '2', '3'],
	},
	{
		id: '2',
		title: 'my column 2',
		itemsOrder: ['4', '4'],
	},
	{
		id: '3',
		title: 'my column 3',
		itemsOrder: ['6', '7', '7'],
	},
];

const myItems = [
	{
		id: '1',
		title: 'item 1',
	},
	{
		id: '2',
		title: 'item 2',
	},
	{
		id: '3',
		title: 'item 3',
	},
	{
		id: '4',
		title: 'item 4',
	},
	{
		id: '5',
		title: 'item 5',
	},
	{
		id: '6',
		title: 'item 6',
	},
	{
		id: '7',
		title: 'item 7',
	},
	{
		id: '8',
		title: 'item 8',
	},
];
