'use scrict';

class SCPane extends HTMLElement {        /* this is what you need for a custom element. A class that Derives from a HTMLElement */
                                                /* and a call to registerElement and where you register the new class . */

  get header () {
    if(!this._header) {
      this._header = this.querySelector('button[role="tab"]');  // we want to provide getter for the Pane area to retrieve the header of it.
    }
    return  this._header;
  }

  get content ()  {
    if(!this._content) {
      this._content = this.querySelector('.content');
    }
    return  this._content;

  }


  attachedCallback () {                               // this will be the events that will fire when we click on the pane.
    this.header.addEventListener('click', evt => {
      const customEvent = new CustomEvent('panel-change', {     // we are going to create a custom event 'panel-change' and bubble the event up to sc-accordion where it will be caught. 
        bubbles: true
      });

      this.dispatchEvent(customEvent);
    });
  }



}

document.registerElement('sc-pane', SCPane);
