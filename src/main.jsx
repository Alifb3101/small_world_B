import './styles/base.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SITE } from './data/content';

document.title = SITE.title;
document.querySelector('meta[name="description"]')?.setAttribute('content', SITE.description);

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// coming back via the browser's back/forward cache would resume mid-story
window.addEventListener('pageshow', (e) => e.persisted && location.reload());

createRoot(document.getElementById('root')).render(createElement(App));
