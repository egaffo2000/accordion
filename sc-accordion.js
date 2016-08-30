'use scrict';

class SCAccordion extends HTMLElement {        /* this is what you need for a custom element. A class that Derives from a HTMLElement */


                                             /* and a call to registerElement and where you register the new class . */
  createdCallback () {
      this._panes = null;

  }

  attachedCallback () {
    this._panes = this.querySelectorAll('sc-pane');       // note that anything beginning with underscore means its meant to be a private memeber or variable.
    this._calculateGeometries();
    this._movePanels();
    this._addEventListerner();

     requestAnimationFrame(_ => this.setAttribute('active', ''));     //we dont want the animation to fire after the objects are active. So we need to do the active as part of the animation.
                                                                      // move panels and then animate.

  }

  detachedCallback () {
      this._panes = null;
  }


  _addEventListerner() {
    this.addEventListener('panel-change', this._onPanelChange);         // this is the custom event from sc-Pane for the onclick.
    this.addEventListener('keydown', evt=> {

      const panesArray = Array.from(this._panes);
      let selectedItem = this.querySelector('sc-pane [role="tab"]:focus');     // we are trying to control the keyboard keys for this up down left and right with the switch below.
      let index = panesArray.indexOf(selectedItem.parentNode);

      switch(evt.keyCode) {
        case 38 :          // up
        case 41 :          // left
          index--;
          break;

        case 39 :          // right
        case 40 :         // down
          index++;
          break;
        default: break;
      }

      // if (index < 0) {           // this if is to increment index until we get to the bottom.
      //   index = 0;
      // } else if ( index >= this._panes.length ) {
      //   index = this._panes.length - 1;
      // }

      index %= this._panes.length;          // this is the modulus operator that allows it to loop back to the top if we go of the end. 
      if (index >= 0 )
          panesArray[index].header.focus();
    });
  }




  _onPanelChange(evt) {

    const target =   evt.target;

    this._panes.forEach(pane => {
      pane.removeAttribute('aria-expanded');     // remove the expanded for all panes. Then below add it to the one that was clicked and tied to the event.
      pane.setAttribute('aria-hidden', 'true')

    });


    target.setAttribute('aria-expanded', 'true');
    target.removeAttribute('aria-hidden');

    requestAnimationFrame(_ => this._movePanels());       //TODO unpack this.

  }


  _calculateGeometries () {
      if (this._panes.length === 0)     // remember that this._panes will return the object Pane from the DOM with the extended class. and a pane is a div with button[role="tab"]
          return;       // we check that the this object actually has values.

      this._headerHeight = this._panes[0].header.offsetHeight;   // this is looking for the height of the pane header in the stylesheet - sc-pane button[role="tab"] that comes from the GET in the class sc-pane
                        // this._panes[0] is a instance of sc-pane class then we call the header function which returns the button obj and we call the height
     this._availableHeight = this.offsetHeight -                    // height of headerheight is 48 and offsetHeight is 600 which is set in max height in the css.  so its 600 -  (3 * 48)
                        (this._panes.length * this._headerHeight);

   }

   _movePanels() {

     let baseY = 0;       // this will allow us to adjust down the content of each pane.
     this._panes.forEach((pane, index) => {
      pane.style.transform = `translateY(${baseY + (this._headerHeight * index)}px)`;
      pane.content.style.height = `${this._availableHeight}px`;                   // the text `${ blah } px     will evaluate the blah and append it to the px and return a string.
                               // we want to move everything not expanded down.
      if(pane.getAttribute('aria-expanded')) {
           baseY = this._availableHeight;      // once we find the expanded attribute then we need to update baseY
        }
      });

   }

}

document.registerElement('sc-accordion', SCAccordion);
