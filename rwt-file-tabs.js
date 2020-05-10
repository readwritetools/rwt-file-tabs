//=============================================================================
//
// File:         /node_modules/rwt-file-tabs/rwt-file-tabs.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: May 2, 2020
// Contents:     Activate view using a file-tab interface
//
//=============================================================================

export default class RwtFileTabs extends HTMLElement {
	
	static elementInstance = 1;		// The elementInstance is used to distinguish between multiple instances of this custom element
	static htmlTemplate = null;		// retrieved from the server once, and used by all instances
	static cssText = null;			// retrieved from the server once, and used by all instances
	
	constructor() {
		super();
				
		// child elements
		this.shell = null;
		this.tabBox = null;
		this.scrollBox = null;
		this.navBox = null;
		this.navLeft = null;
		this.navRight = null;

		// observer
		this.resizeObserver = null;
		
		// properties
		this.instance = RwtFileTabs.elementInstance++;
		this.repeatingScroll = null;	// press and hold timer
		this.scrollableOverflow = 0;	// number of pixels available to scroll
		this.currentTabId = null;		// element ID of the current tab
		this.currentTabValue = null;	// text of the current tab
		
		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		// guard against possible call after this has been disconnected
		if (!this.isConnected)
			return;

		var htmlTemplate = await this.getTemplate();
		var htmlFragment = this.convertTemplateToFragment(htmlTemplate);
		
		var cssText = await this.getCssText();
		var styleElement = this.convertCssTextToElement(cssText);

		// append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		this.registerEventListeners();
		this.configureSlottedTabs();
		this.onResize();
		this.sendComponentLoaded();
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//< returns a promise to the htmlTemplate 
	getTemplate() {
		return new Promise((resolve, reject) => {
			// setup the completion event listener
			document.addEventListener('html-template-ready', function(e) {
				resolve(RwtFileTabs.htmlTemplate);
			});
			
			// perform the work that will eventually trigger the completion event
			this.fetchTemplate();
		});
	}
	
	//^ Fetch the HTML template from the server, but only on the first instance.
	//  All subsequent instances await the 'html-template-ready' event
	//< returns an HTML text fragment
	//< returns without getting the template if server does not respond with 200 or 304
	async fetchTemplate() {
		if (this.instance == 1) {
			var response = await fetch('/node_modules/rwt-file-tabs/rwt-file-tabs.blue', {cache: "no-cache", referrerPolicy: 'no-referrer'});
			if (response.status != 200 && response.status != 304)
				return null;
			RwtFileTabs.htmlTemplate = await response.text();
			document.dispatchEvent(new Event('html-template-ready'));
		}
		else if (RwtFileTabs.htmlTemplate == null) {
			 // Nothing to do. Caller must wait for 'html-template-ready' event to be received
		}
		else { // (RwtFileTabs.htmlTemplate != null)
			document.dispatchEvent(new Event('html-template-ready'));
		}
	}
	
	// create a template and turn its content into a document fragment
	convertTemplateToFragment(htmlTemplate) {
		var template = document.createElement('template');
		template.innerHTML = htmlTemplate;
		return template.content;
	}	
	
	//< returns a promise to the CSS Text 
	getCssText() {
		return new Promise((resolve, reject) => {
			// setup the completion event listener
			document.addEventListener('css-text-ready', function(e) {
				resolve(RwtFileTabs.cssText);
			});
			
			// perform the work that will eventually trigger the completion event
			this.fetchCSS();
		});
	}
		
	//^ Fetch the CSS text from the server, but only on the first instance.
	//  All subsequent instances await the 'css-text-ready' event
	//< returns CSS declarations
	//< returns null if server does not respond with 200 or 304
	async fetchCSS() {
		if (this.instance == 1) {
			var response = await fetch('/node_modules/rwt-file-tabs/rwt-file-tabs.css', {cache: "no-cache", referrerPolicy: 'no-referrer'});
			if (response.status != 200 && response.status != 304)
				return null;
			RwtFileTabs.cssText = await response.text();
			document.dispatchEvent(new Event('css-text-ready'));
		}
		else if (RwtFileTabs.cssText == null) {
			 // Nothing to do. Caller must wait for 'css-text-ready' event to be received
		}
		else { // (RwtFileTabs.cssText != null)
			document.dispatchEvent(new Event('css-text-ready'));
		}
	}	
	
	// create a <style> element from CSS text 
	convertCssTextToElement(cssText) {
		var styleElement = document.createElement('style');
		styleElement.innerHTML = cssText;
		return styleElement;
	}
	
	//^ Identify this component's children
	identifyChildren() {
		this.shell = this.shadowRoot.getElementById('shell');
		this.tabBox = this.shadowRoot.getElementById('tab-box');			// outer box, sized to the shell
		this.scrollBox = this.shadowRoot.getElementById('scroll-box');		// inner box, sized by the number of tabs
		this.navBox = this.shadowRoot.getElementById('nav-box');
		this.navLeft = this.shadowRoot.getElementById('nav-left');
		this.navRight = this.shadowRoot.getElementById('nav-right');
	}
	
	registerEventListeners() {		
		this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
		this.resizeObserver.observe(this.shell);		// may change size when the custom element changes size
		this.resizeObserver.observe(this.tabBox);		// may change size when the shell changes size
		this.resizeObserver.observe(this.scrollBox);	// may change size when tabs are added or removed
		
		// component events
		this.navLeft.addEventListener('mousedown', this.onMousedownNavLeft.bind(this));
		this.navRight.addEventListener('mousedown', this.onMousedownNavRight.bind(this));
		document.addEventListener('mouseup', this.onMouseup.bind(this));
		this.tabBox.addEventListener('wheel', this.onWheelTabBox.bind(this));
	}	

	// If the developer has slotted in tabs, add event listeners for clicking on the tab
	configureSlottedTabs() {
		var tabElements = this.querySelectorAll('button');
		for (let i=0; i < tabElements.length; i++) {
			var elTab = tabElements[i]; 
			elTab.classList.add('tab-button');
			elTab.addEventListener('click', this.onClickTab.bind(this));
		}
	}
	
	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------
	getCurrentTab() {
		return {
			currentTabId: this.currentTabId,
			currentTabValue: this.currentTabValue
		};
	}
	
	setCurrentTab(id) {
		// special case, when removing the last tab
		if (id == null) {
			this.currentTabId = null;
			this.currentTabValue = null;
			this.sendTabActiviated();
			return;
		}
		
		// sanity, make sure such an ID exists
		if (this.shadowRoot.getElementById(id) == null && document.getElementById(id) == null)
			return;
					
		// dynamically added tabs
		var tabElements = this.shadowRoot.querySelectorAll('#scroll-box button');
		for (let i=0; i < tabElements.length; i++) {
			var el = tabElements[i];
			if (el.id == id) {
				el.classList.add('current-tab');
				this.currentTabId = id;
				this.currentTabValue = el.childNodes[0].nodeValue;
			}
			else
				el.classList.remove('current-tab');
		}
		
		// slotted tabs
		var tabElements = this.querySelectorAll('button');
		for (let i=0; i < tabElements.length; i++) {
			var el = tabElements[i];
			if (el.id == id) {
				el.classList.add('current-tab');
				this.currentTabId = id;
				this.currentTabValue = el.childNodes[0].nodeValue;
			}
			else
				el.classList.remove('current-tab');
		}

		// inform the document's custom element that the current tab has changed
		this.sendTabActiviated();
	}
	
	removeTab(id) {
		// sanity, make sure such an ID exists
		if (this.shadowRoot.getElementById(id) == null && document.getElementById(id) == null)
			return;

		// capture the most recently added tab, in case the current tab is the one being removed
		var mruTabId = null;
		
		// dynamically added tabs
		var tabElements = this.shadowRoot.querySelectorAll('#scroll-box button');
		for (let i=0; i < tabElements.length; i++) {
			var el = tabElements[i];
			if (el.id == id)
				el.remove();
			else
				mruTabId = el.id;
		}
		
		// slotted tabs
		var tabElements = this.querySelectorAll('button');
		for (let i=0; i < tabElements.length; i++) {
			var el = tabElements[i];
			if (el.id == id)
				el.remove();
			else
				mruTabId = el.id;
		}

		// if tab just removed was the current tab, activate the most recently added one
		if (this.currentTabId == id)
			this.setCurrentTab(mruTabId);
	}
	
	// insert at the beginning (leftmost)
	//> id is the element ID to assign to the tab
	//> value is the inner HTML for the tab
	//> title is the hover popup title, it may be null
	insertTab(id, value, title) {
		var elTab = document.createElement('button');
		elTab.id = id;
		elTab.innerHTML = value
		elTab.className = 'tab-button';
		if (title != null)
			elTab.setAttribute('title', title);

		this.scrollBox.prepend(elTab);
		elTab.addEventListener('click', this.onClickTab.bind(this));
		
		this.addCloseButtonToTab(elTab);
	}
	
	getScrollableOverflow() {
		return this.scrollableOverflow;
	}
	
	// number of pixels scrolled from the left
	// Provide a positive integer 
	setScrollPosition(left) {
		var newLeft = 0 - left;
		if (newLeft < 0) 
			this.scrollBox.style.left = `${newLeft}px`;
		else if (this.scrollableOverflow + newLeft >= 0)
			this.scrollBox.style.left = `${newLeft}px`;
	}
	
	scrollMaxRight() {
		var left = 0 - this.scrollableOverflow;
		this.scrollBox.style.left = `${left}px`;
	}
	
	//-------------------------------------------------------------------------
	// private helpers
	//-------------------------------------------------------------------------

	//^ If the custom element has a "closable" attribute defined,
	//  add an 'x' button and set up a listener for it.
	//> elTab is the just-created tab element 
	addCloseButtonToTab(elTab) {
		if (this.hasAttribute('closable')) {
			
			var elCloseButton = document.createElement('button');
			elCloseButton.innerHTML = '×';
			elCloseButton.className = 'x-button';
			
			elTab.prepend(elCloseButton);			
			elCloseButton.addEventListener('click', this.onClickClose.bind(this));
		}
	}
	
	//-------------------------------------------------------------------------
	// component messages
	//-------------------------------------------------------------------------
	
	// inform the document's custom element that it is ready for programmatic use 
	sendComponentLoaded() {
		this.dispatchEvent(new Event('component-loaded', {bubbles: true}));
	}

	// inform the document's custom element that the current tab has changed
	sendTabActiviated() {
		var eventInit = { detail: {
			currentTabId: this.currentTabId,
			currentTabValue: this.currentTabValue
			} };
		var customEvent = new CustomEvent('tab-activated', eventInit);
		this.dispatchEvent(customEvent);
	}

	//^ inform the document's custom element that the user has requested a tab be closed
	//> elTab is the tab that is being closed
	//< returns false if the user called preventDefault() to cancel the pending operation
	//< returns true to allow the tab to be closed
	sendTabClosing(elTab) {
		var eventInit = { 
			cancelable: true,		// user can call preventDefault to cancel the close
			detail: {
				currentTabId: elTab.id,
				currentTabValue: elTab.childNodes[0].nodeValue
			} };
		var customEvent = new CustomEvent('tab-closing', eventInit);
		return this.dispatchEvent(customEvent);
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// recompute the amount of overflow
	// tabBox varies in size based on how many tabs it currently has
	onResize(entries) {
		// does any extra space, not occupied by tabs, go on the right or left side? 
		var anchorSide = this.hasAttribute('anchor-side') ? this.getAttribute('anchor-side') : 'right';

		var extraPixels = 0;

		// show left/right scrollers
		if (this.scrollBox.offsetWidth <= this.shell.offsetWidth) {
			this.navBox.style.display = 'none';
			this.scrollBox.style.left = '0px';
			var newTabBoxWidth = this.scrollBox.offsetWidth;
			this.tabBox.style.width = `${newTabBoxWidth}px`;

			if (anchorSide == 'right') {
				extraPixels = this.shell.offsetWidth - newTabBoxWidth;
			}
		}
		// hide left/right scrollers
		else {
			this.navBox.style.display = 'block';
			var newTabBoxWidth = this.shell.offsetWidth - this.navBox.offsetWidth;
			this.tabBox.style.width = `${newTabBoxWidth}px`;

			// when enlarging the window, reposition the scrollBox's left to use the newly available space
			if (this.scrollBox.offsetLeft < 0) {
				var repositionedLeft = this.tabBox.offsetWidth - this.scrollBox.offsetWidth;
				if (repositionedLeft < 0) {
					this.scrollBox.style.left = `${repositionedLeft}px`;
				}
			}
		}
		
		this.scrollableOverflow = this.scrollBox.offsetWidth - newTabBoxWidth;
		if (this.scrollableOverflow < 0)
			this.scrollableOverflow = 0;
		
		this.changeScrollSide(extraPixels);
	}
	
	// Position the scroller buttons to the left or right of the tabs 
	//> extraPixels is 0 when the space occupied by the tabs is more than the space available for them
	//> extraPixels is a positive integer when there is more space available than is needed by the tabs
	changeScrollSide(extraPixels) {
		// do the left and right scroll buttons, when needed, go on the right or left side?
		var scrollSide = this.hasAttribute('scroll-side') ? this.getAttribute('scroll-side') : 'right';
		
		if (scrollSide == 'left') {
			var firstBoxLeft = `${extraPixels}px`;
			this.navBox.style.left = firstBoxLeft;
			
			var secondBoxLeft = extraPixels + this.navBox.offsetWidth;
			this.tabBox.style.left = `${secondBoxLeft}px`;
		}
		else { // scrollSide == 'right'
			var firstBoxLeft = `${extraPixels}px`;
			this.tabBox.style.left = firstBoxLeft;
			
			var secondBoxLeft = extraPixels + this.tabBox.offsetWidth;
			this.navBox.style.left = `${secondBoxLeft}px`;
		}			
	}
	
	onMousedownNavLeft(event) {
		event.preventDefault();
		var boundFunction = this.scrollLeft.bind(this);
		this.repeatingScroll = setInterval(boundFunction, 10);
	}
	
	scrollLeft() {
		var scrollIncrement = Math.floor(this.scrollableOverflow / 50);
		scrollIncrement = Math.min(scrollIncrement, 5);
		scrollIncrement = Math.max(scrollIncrement, 1);
		
		var newLeft = this.scrollBox.offsetLeft + scrollIncrement;
		if (newLeft < 0) {
			this.scrollBox.style.left = `${newLeft}px`;
		}
		else {
			clearInterval(this.repeatingScroll);
			this.repeatingScroll = null;
		}
	}
	
	onMousedownNavRight(event) {
		event.preventDefault();
		var boundFunction = this.scrollRight.bind(this);
		this.repeatingScroll = setInterval(boundFunction, 10);
	}
	
	scrollRight() {
		var scrollIncrement = Math.floor(this.scrollableOverflow / 50);
		scrollIncrement = Math.min(scrollIncrement, 5);
		scrollIncrement = Math.max(scrollIncrement, 1);
		
		var newLeft = this.scrollBox.offsetLeft - scrollIncrement;
		if (this.scrollableOverflow + newLeft >= 0) {
			this.scrollBox.style.left = `${newLeft}px`;
		}
		else {
			clearInterval(this.repeatingScroll);
			this.repeatingScroll = null;
		}
	}
	
	onMouseup(event) {
		if (this.repeatingScroll != null) {
			clearInterval(this.repeatingScroll);
			this.repeatingScroll = null;
		}
	}
	
	onClickTab(event) {
		this.setCurrentTab(event.target.id);
	}
	
	// user clicked on a tab's '×' button to close it
	onClickClose(event) {
		var elTab = event.target.parentElement;
		
		// give the document a chance to decide whether or not to remove the tab
		var rc = this.sendTabClosing(elTab);
		if (rc == true)
			this.removeTab(elTab.id);
	}
	
	onWheelTabBox(event) {
		var scrollIncrement = Math.floor(this.scrollableOverflow / 10);
		scrollIncrement = Math.max(scrollIncrement, 1);
			
		if (event.deltaY > 0) {
			var newLeft = this.scrollBox.offsetLeft + scrollIncrement;
			if (newLeft < 0)
				this.scrollBox.style.left = `${newLeft}px`;
		}
		else {
			var newLeft = this.scrollBox.offsetLeft - scrollIncrement;
			if (this.scrollableOverflow + newLeft >= 0)
				this.scrollBox.style.left = `${newLeft}px`;
		}
	}
}

window.customElements.define('rwt-file-tabs', RwtFileTabs);