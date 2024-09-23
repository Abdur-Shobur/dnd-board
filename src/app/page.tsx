import dynamic from 'next/dynamic';

const DragDropComponent = dynamic(() => import('@/components/board'), {
	ssr: false,
});
const DragDropComponent2 = dynamic(() => import('@/components-2/board'), {
	ssr: false,
});
const DragDropComponent3 = dynamic(() => import('@/components-3/board'), {
	ssr: false,
});
export default function page() {
	return (
		<div>
			{/* <DragDropComponent /> */}
			<DragDropComponent3 />
		</div>
	);
}

/* 
	const [preview, setPreview] = useState({ data: null, api: null });
			setPreview({ data: reorderedColumns, api: '/api/save-columns' });
			setPreview({
				data: updatedData[source.droppableId],
				api: `/api/save-column/${source.droppableId}`,
			});
			setPreview({
				data: {
					source: updatedData[source.droppableId],
					destination: updatedData[destination.droppableId],
				},
				api: `/api/save-column/${source.droppableId}`,
			});


<div className="mt-4">
<h2 className="text-lg font-bold">Preview</h2>
<p>
	<strong>API:</strong> {preview.api}
</p>
<p>
	<strong>Data:</strong> {JSON.stringify(preview.data, null, 2)}
</p>
</div>

*/
