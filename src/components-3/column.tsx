import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ColumnProps } from './board';
import DealCardItem from './item';

const Column: React.FC<ColumnProps> = ({ itemsOrder, id, ITEMS }) => {
	console.log({ itemsOrder, id, ITEMS });
	return (
		<Droppable droppableId={id}>
			{(provided) => (
				<div
					className="min-h-[85%]"
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
