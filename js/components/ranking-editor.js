export class RankingEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this._currentTarget = null;
    }

    connectedCallback() {
        const style = this.getStyle();
        const template  = this.getTemplate();

        this.shadowRoot.append(style, template);
        this.createEvents();
    }

    getTemplate() {
        const colors   = ['#f0f','#0ff','#ff0','#f00','#0f0',
                            '#00f','#f60','#f39','#3cf','#c3f'];

        const radio_color   = Array.from(colors, this.createRadioColor).join('');

        const overlay   = document.createElement('div');
        overlay.id  = 'menu-overlay';

        overlay.insertAdjacentHTML('beforeend', `
        <div id='menu-modal'>
            <div id='container-colors'>${radio_color}</div>
            <textarea id='menu-editor-txtarea'></textarea>
            <button id='menu-cancelar-editor'>cancelar</button>
            <button id='menu-salvar-editor'>salvar</button>
        </div>
        `);
        
        return overlay;
    }

    createRadioColor(arg) {

        const label = `
        <label class='label-radioColor' style='background-color:${arg}'>
            <input type='radio' value='${arg}' name='radio-color' hidden/>
        </label>
        `;

        return label;
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent   = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        #menu-overlay {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;    
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: all;
            background-color: #0003;
            z-index: 99;
            overflow-y: auto;
        }

        #menu-modal {
            width: min(100%, 50rem);
            height: min(max-content, 100%);
            background-color: white;
            padding: .5rem;
        }

        #container-colors {
            display:flex;
            justify-content: space-between;
            border-bottom: .1rem solid black;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }

        .label-radioColor {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2rem;
            height: 2rem;
            border-radius: 2rem;
            cursor: pointer;
            border: .1rem solid black;
        }

        .label-radioColor:has(input:checked)::before {
            content: '';
            display: block;
            width: 60%;
            height: 60%;
            border-radius: 100%;
            background-color: black;
            opacity: .5;
        }

        #menu-editor-txtarea {
            width: 100%;
            height: 6em;
            resize: none;
            font-size: x-large;
        }
        `;

        return style;
    }
    
    createEvents() {
        const overlay   = this.shadowRoot.querySelector('#menu-overlay');
        const modal = this.shadowRoot.querySelector('#menu-modal');
        const cancelar_btn  = this.shadowRoot.querySelector('#menu-cancelar-editor');
        const salvar_btn    = this.shadowRoot.querySelector('#menu-salvar-editor');
        
        overlay.onclick = () => this.currentTarget = null;
        modal.onclick   = (ev) => ev.stopPropagation();
        cancelar_btn.onclick    = () => this.currentTarget = null;
        salvar_btn.onclick  = () => {
            this.currentTarget.boxTitleValues   = {
                'title' : this.txtArea_value,
                'color' : this.radioColor
            };

            this.currentTarget  = null;
        };
    }

    set currentTarget(newID) {
        
        this._currentTarget = document.querySelector(`#${newID}`);
        if(this._currentTarget  === null) {
            this.classList.remove('open');
            return null;
        }

        this.classList.add('open')
        this.txtArea_value  = this._currentTarget.dataset.title;
    }

    get currentTarget() {
        return this._currentTarget;
    }

    get radioColor() {
        const radio_colors  = this.shadowRoot.querySelector('input[name="radio-color"]:checked');

        return radio_colors?.value;
    }

    get txtArea_value() {
        const txtarea   = this.shadowRoot.querySelector('#menu-editor-txtarea');

        return txtarea.value;
    }

    set txtArea_value(new_value) {
        const txtarea   = this.shadowRoot.querySelector('#menu-editor-txtarea');
        txtarea.value   = new_value;
    }
}