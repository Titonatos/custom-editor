class TemplatesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.init();
  }

  init() {
    this.templates = window.getTemplates();
    this.selectedIndex = null;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .panel { solid #ccc; padding: 10px; width: 250px; }
        .templates { border: 1px solid; padding: 10px 5px; margin-top: 10px; }
        .templates div { cursor: pointer; padding: 4px; border-radius: 4px; }
        .templates div.selected { background: #ddd; }
        .templates-wrap {  padding: 5px; }
        input { width: 100%; padding: 5px; box-sizing: border-box; }
        .buttons { display: flex; justify-content: flex-end; gap: 5px;}
        .buttons button { width: 25px; height: 25px;}
        #edit { margin-top: 10px; }
        #remove { background-color: red; }
        #add { background-color: green; }
      </style>
      <div class="panel">
        <strong>Templates</strong>
        <div class="templates"></div>
        <div class="buttons">
          <button id="remove">-</button>
          <button id="add">+</button>
        </div>
        <label>Edit tamplate</label>
        <input id="edit" placeholder="Edit template" />
      </div>
    `;

    this.updateList();

    this.shadowRoot.getElementById('add').onclick = () => {
      this.templates.push('template');
      this.selectedIndex = this.templates.length - 1;
      this.updateList();
      this.syncTemplates();
    };

    this.shadowRoot.getElementById('remove').onclick = () => {
      if (this.selectedIndex !== null) {
        this.templates.splice(this.selectedIndex, 1);
        this.selectedIndex = null;
        this.updateList();
        this.syncTemplates();
      }
    };

    const editInput = this.shadowRoot.getElementById('edit');
    editInput.oninput = (e) => {
      if (this.selectedIndex !== null) {
        this.templates[this.selectedIndex] = e.target.value;
        this.updateList();
      }
    };
    
    editInput.onblur = () => this.syncTemplates();
    editInput.onkeydown = e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.syncTemplates();
      }
    };
  }

  updateList() {
    const list = this.shadowRoot.querySelector('.templates');
    list.innerHTML = '';
    this.templates.forEach((tpl, index) => {
      const div = document.createElement('div');
      div.textContent = tpl;
      if (index === this.selectedIndex) div.classList.add('selected');
      div.onclick = () => {
        this.selectedIndex = index;
        this.shadowRoot.getElementById('edit').value = tpl;
        this.updateList();
      };
      list.appendChild(div);
    });
  }

  syncTemplates() {
    window.updateTemplates(this.templates);
  }
}

if (typeof window.getTemplates === 'function') {
  customElements.define('templates-panel', TemplatesPanel);
} else {
  const checkInterval = setInterval(() => {
    if (typeof window.getTemplates === 'function') {
      clearInterval(checkInterval);
      customElements.define('templates-panel', TemplatesPanel);
    }
  }, 10);
}
