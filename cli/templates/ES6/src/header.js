import { create as dojoCreate, place as dojoPlace } from 'dojo/dom-construct';
export default function(dummyText) {
    const headerWrapper = dojoCreate('div', { class: 'custom-header' });
    dojoPlace(dojoCreate('h1', { innerHTML: dummyText }), headerWrapper);
    return headerWrapper;
}
