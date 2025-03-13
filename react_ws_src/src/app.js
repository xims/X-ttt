import React from 'react'
import app from 'ampersand-app'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, browserHistory  } from 'react-router'
import ga from 'react-ga'

import './sass/main.scss'

import Main from './views/Main'
import Ttt from './views/ttt/Ttt'
import Txt_page from './views/pages/Txt_page'
import PopUp_page from './views/pages/PopUp_page'
import Contact from './views/pages/Contact'
import ErrorPage from './views/pages/ErrorPage'
import prep_env from './models/prep_env'

window.app = app

app.extend({
	settings: {
		is_mobile: false,
		mobile_type: null,
		can_app: false,
		ws_conf: null,
		curr_user: null,
		user_ready: false,
		user_types: [],
		basket_type: null,
		basket_total: 0,
	},

	init() {
		prep_env(this.start.bind(this))
	},

	start_ga() {
		ga.initialize(app.settings.ws_conf.conf.ga_acc.an, { debug: true });
		browserHistory.listen(location => {
			ga.pageview(location.pathname);
		});
	},

	start() {
		this.start_ga();
		renderSite();
	},

	show_page(u) {
		switch(u) {
			case 'home':
				browserHistory.push('/');
				break;
			default:
				console.log('show_page event with:', u);
				browserHistory.push(u);
				break;
		}
	},

	events: {
		show_message: 'show_message',
		show_page: 'show_page'
	},
});

let renderSite = function () {
	if (!app.settings || !app.settings.ws_conf) {
		setTimeout(renderSite, 100);
		return;
	}
	return render((
		<Router history={browserHistory}>
			<Route path='/' component={Main}>
				<IndexRoute components={{mainContent: Txt_page}} />
				<Route path='/pg/(:page)' components={{mainContent: Txt_page}} />
				<Route path='/ttt' components={{mainContent: Ttt}} />
				<Route path='/pupg/(:pu_page)' components={{popup: PopUp_page}} />
				<Route path='/contact-us' components={{popup: Contact}} />
				<Route path='/error/404' components={{mainContent: ErrorPage}} />
				<Route path="*" components={{mainContent: ErrorPage}} />
			</Route>
		</Router>
	), document.getElementById('root'));
}

app.init();
app.on(app.events.show_page, app.show_page);
