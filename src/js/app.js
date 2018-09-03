class Whoops {

	constructor(options){
		if ( !options.message ) {
	        throw new Error('Whoops.js - You need to set key with value of string to display');
	        return;
	    }
	    this.whoopsContainerEl = document.querySelector('.whoops-container');
    	this.whoopsEl = document.querySelector('.whoops');
  
    	this.options = options;
	    this.type = options.type || options.default;

	    if(options.timeout){
	    	this.timeout = options.timeout;
	    }

	    this._init();
	}

	_createElements(){
		return new Promise((resolve, reject) => {
	        this.whoopsContainerEl = document.createElement('div');
	        this.whoopsContainerEl.classList.add('whoops-container');
	        this.whoopsContainerEl.setAttribute('role', 'alert');
	        this.whoopsContainerEl.setAttribute('aria-hidden', true); 

	        this.whoopsEl = document.createElement('div');
	        this.whoopsEl.classList.add('whoops');

	        this.whoopsContainerEl.appendChild(this.toastEl);
	        document.body.appendChild(this.whoopsContainerEl);

	        setTimeout(() => resolve(), 500);
	    });
	}

	_addEventListeners(){
		document.querySelector('.whoops-btn--close').addEventListener('click', () => {
	        this._close();
	    })

	    if ( this.options.customButtons ) {
	        const customButtonsElArray = Array.prototype.slice.call( document.querySelectorAll('.whoops-btn--custom') );
	        customButtonsElArray.map( (el, index) => {
	            el.addEventListener('click', (event) => this.options.customButtons[index].onClick(event) );
	        });
	    }
	}

	_close(){
		return new Promise((resolve, reject) => {
	        this.whoopsContainerEl.setAttribute('aria-hidden', true); 
	        setTimeout(() => {
	            this.whoopsEl.innerHTML = '';
	            this.whoopsEl.classList.remove('default', 'success', 'warning', 'danger');
	            if ( this.focusedElBeforeOpen ) {
	                this.focusedElBeforeOpen.focus();
	            }
	            resolve();
	        }, 1000); 
	    });
	}

	_open(){
		this.whoopsEl.classList.add(this.options.type);
	    this.whoopsContainerEl.setAttribute('aria-hidden', false); 

	    let customButtons = '';
	    if ( this.options.customButtons ) {
	        customButtons = this.options.customButtons.map( (customButton, index) => {
	            return `<button type="button" class="whoops-btn whoops-btn--custom">${customButton.text}</button>`
	        } )
	        customButtons = customButtons.join('');
	    }

	    this.whoopsEl.innerHTML = `
	        <p>${this.options.message}</p>
	        <button type="button" class="whoops-btn whoops-btn--close">Close</button>
	        ${customButtons}
	    `;

	    this.focusedElBeforeOpen = document.activeElement;
	    document.querySelector('.whoops-btn--close').focus();
	}

	_init(){
		Promise.resolve().then(() => {
	        if ( this.whoopsContainerEl ) { 
	            return Promise.resolve();
	        }
	        return this._createElements();
	    }).then(() => {
	        if ( this.whoopsContainerEl.getAttribute('aria-hidden') == 'false'  ) {
	            return this._close();
	        }
	        return Promise.resolve();
	    }).then(() => {
	        this._open();
	        this._addEventListeners();
	    })
	}
}

window.Whoops = Whoops;