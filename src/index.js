import './style.css';
import './templates-panel';

let templates = ['template 1', 'template 2', 'template 3'];

window.getTemplates = () => templates;

window.updateTemplates = (newTemplates) => {
  templates = [...newTemplates];
  const iframe = document.querySelector('iframe');
  if (!iframe) return;
  const selects = iframe.contentDocument.querySelectorAll('select.custom-template');
  selects.forEach(select => {
    const selectedValue = select.value;
    if (!templates.includes(selectedValue)) {
      select.innerHTML = '<option>ERROR</option>';
    } else {
      select.innerHTML = templates.map(t => `<option>${t}</option>`).join('');
      select.value = selectedValue;
    }
  });
};

function renderEditor() {
  tinymce.init({
    selector: '#editor',
    height: 400,
    width: 400,
    statusbar: false,
    menubar: false,
    toolbar: 'insertCustomComponent',
    setup(editor) {
      editor.ui.registry.addButton('insertCustomComponent', {
        text: 'Insert',
        onAction: () => {
          const selectHtml = `<select class="custom-template">
            ${templates.map(t => `<option>${t}</option>`).join('')}
          </select>`;
          editor.insertContent(selectHtml);
        }
      });
    },
  });
}

renderEditor();