import './styles/base.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(createElement(App));
