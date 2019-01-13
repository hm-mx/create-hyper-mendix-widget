import { h, app } from 'hyperapp';

export default function(widgetProps,mountingDomNode) {
	const state = {
		count: 0,
		...widgetProps
	};
	
	const actions = {
		down: (value) => (state) => ({ count: state.count - value }),
		up: (value) => (state) => ({ count: state.count + value })
	};
	
	const Counter = (state, actions) => (
		<div className="hyperapp-counter">
			<div className="counter-header">
				<span>•••</span>
				<h1>{state.dummyKey}</h1>
				<span>•••</span>
			</div>
			<h1 className="counter-count">{state.count}</h1>
			<div className="controls-wrapper">
				<button className="counter-btn" onclick={() => actions.down(1)}>
					-
				</button>
				<button className="counter-btn" onclick={() => actions.up(1)}>
					+
				</button>
			</div>
		</div>
	);
	app(state, actions, Counter, mountingDomNode);
}
