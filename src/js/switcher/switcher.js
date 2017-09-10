class TkSwitcherElement extends HTMLElement {
  /* Attributes to monitor */
  static get observedAttributes() { return ['type', 'offText', 'onText']; }
  get type() { return this.getAttribute('type'); }
  set type(value) { return this.setAttribute('type', value); }
  get offText() { return this.getAttribute('offText') || 'Off'; }
  get onText() { return this.getAttribute('onText') || 'On'; }

  constructor() {
    super();

    this.inputs = [];
    this.spans = [];
    this.inputsContainer = '';
    this.spansContainer = '';
    this.newActive = '';
  }

  /* Lifecycle, element appended to the DOM */
  connectedCallback() {
    this.inputs = [].slice.call(this.querySelectorAll('input'));

    if (this.inputs.length !== 2 || this.inputs[0].type !== 'radio') {
      throw new Error('`Tk-switcher` requires two inputs type="checkbox"');
    }

    // Create the markup
    this.createMarkup.bind(this)();

    this.inputsContainer = this.firstElementChild;
    this.spansContainer = this.lastElementChild;

    if (this.inputs[1].checked) {
      this.inputs[1].parentNode.classList.add('active');
      this.spans[1].classList.add('active');
    } else {
      this.spans[0].classList.add('active');
    }

    this.inputs.forEach((switchEl, index) => {
      // Remove the tab focus from the inputs
      switchEl.setAttribute('tabindex', '-1');

      // Aria-labelledby ONLY in the first input
      switchEl.setAttribute('role', 'switch');
      switchEl.setAttribute('aria-labelledby', this.spans[index].innerHTML);

      // Add the active class on click
      switchEl.addEventListener('click', this.toggle.bind(this));
    });

    this.inputsContainer.addEventListener('keydown', this.keyEvents.bind(this));
  }

  /* Lifecycle, element removed from the DOM */
  disconnectedCallback() {
    this.removeEventListener('toiletkit.switcher.toggle', this.toggle, true);
    this.removeEventListener('click', this.switch, true);
    this.removeEventListener('keydown', this.keydown, true);
  }

  /* Method to dispatch events */
  dispatchCustomEvent(eventName) {
    const OriginalCustomEvent = new CustomEvent(eventName, { bubbles: true, cancelable: true });
    OriginalCustomEvent.relatedTarget = this;
    this.dispatchEvent(OriginalCustomEvent);
    this.removeEventListener(eventName, this);
  }

  /** Method to build the switch */
  createMarkup() {
    let checked = 0;

    // Create the first 'span' wrapper
    const spanFirst = document.createElement('span');
    spanFirst.classList.add('switcher');
    spanFirst.setAttribute('tabindex', 0);

    // If no type has been defined, the default as "success"
    if (!this.type) {
      this.setAttribute('type', 'success');
    }

    const switchEl = document.createElement('span');
    switchEl.classList.add('switch');

    this.inputs.forEach((input, index) => {
      if (input.checked) {
        input.setAttribute('aria-checked', true);
      }

      spanFirst.appendChild(input);

      if (index === 1 && input.checked) {
        checked = 1;
      }
    });

    spanFirst.appendChild(switchEl);

    // Create the second 'span' wrapper
    const spanSecond = document.createElement('span');
    spanSecond.classList.add('switcher-labels');

    const labelFirst = document.createElement('span');
    labelFirst.classList.add('switcher-label-0');
    labelFirst.innerText = this.offText;

    const labelSecond = document.createElement('span');
    labelSecond.classList.add('switcher-label-1');
    labelSecond.innerText = this.onText;

    if (checked === 0) {
      labelFirst.classList.add('active');
    } else {
      labelSecond.classList.add('active');
    }

    this.spans.push(labelFirst);
    this.spans.push(labelSecond);
    spanSecond.appendChild(labelFirst);
    spanSecond.appendChild(labelSecond);

    // Append everything back to the main element
    this.appendChild(spanFirst);
    this.appendChild(spanSecond);
  }

  /** Method to toggle the switch */
  switch() {
    this.spans.forEach((span) => {
      span.classList.remove('active');
    });

    if (this.inputsContainer.classList.contains('active')) {
      this.inputsContainer.classList.remove('active');
    } else {
      this.inputsContainer.classList.add('active');
    }

    if (!this.inputs[this.newActive].classList.contains('active')) {
      this.inputs.forEach((input) => {
        input.classList.remove('active');
        input.removeAttribute('checked');
        input.removeAttribute('aria-checked');
      });
      this.inputs[this.newActive].classList.add('active');
      this.inputs[this.newActive].setAttribute('aria-checked', true);

      this.dispatchCustomEvent('toiletkit.switcher.on');
    } else {
      this.inputs.forEach((input) => {
        input.classList.remove('active');
        input.removeAttribute('checked');
        input.setAttribute('aria-checked', false);
      });

      this.dispatchCustomEvent('toiletkit.switcher.off');
    }

    this.inputs[this.newActive].setAttribute('checked', '');
    this.inputs[this.newActive].setAttribute('aria-checked', true);
    this.spans[this.newActive].classList.add('active');
  }

  /** Method to toggle the switch */
  toggle() {
    //e.preventDefault();
    this.newActive = this.inputs[1].classList.contains('active') ? 0 : 1;

    this.switch.bind(this)();
  }

  keyEvents(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault();
      this.newActive = this.inputs[1].classList.contains('active') ? 0 : 1;

      this.switch.bind(this)();
    }
  }
}

customElements.define('tk-switcher', TkSwitcherElement);
