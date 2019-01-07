import { create as dojoCreate } from 'dojo/construct';

export default function(DummyText) {
    return dojoCreate('h1', { class: 'header' });
}
