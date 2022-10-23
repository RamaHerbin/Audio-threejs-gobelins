import './style.css'

import Application from './js/App.js';

window.application = new Application({
    $canvas: document.querySelector('.js-canvas'),
});