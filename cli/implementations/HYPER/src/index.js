import _widgetBase from 'MxWidgetBase';
import declare from 'dojoBaseDeclare';
import * as widgetConf from '../conf/widget.config.json';
import './style/style.scss';

import Counter from './Counter';

export default declare(`${widgetConf.name}.widget.${widgetConf.name}`, [ _widgetBase ], {
	constructor() {},
	postCreate() {
		console.debug(`${this.id} >> postCreate`);
	},
	update(contextObject, callback) {
		console.debug(`${this.id} >> update`);
		Counter({dummyKey : this.dummyKey},this.domNode);
		callback();
	}
});
