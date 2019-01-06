import { h, app } from 'hyperapp';

const state = {
	count: 0
};

const actions = {
	down: (value) => (state) => ({ count: state.count - value }),
	up: (value) => (state) => ({ count: state.count + value })
};

const counter = (state, actions) => (
	<div className="counter">
		<div className="counter-header">
			<span>•••</span>
			<h1>My Cool Counter</h1>
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

export default function(mountingDomNode) {
	app(state, actions, counter, mountingDomNode);
}
