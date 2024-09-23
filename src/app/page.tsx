import dynamic from 'next/dynamic';

// const DragDropComponent = dynamic(() => import('@/components/board'), {
// 	ssr: false,
// });
// const DragDropComponent2 = dynamic(() => import('@/components-2/board'), {
// 	ssr: false,
// });
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
