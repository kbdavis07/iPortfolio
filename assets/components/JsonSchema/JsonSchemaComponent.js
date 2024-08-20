class JsonResumeSchemaComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const jsonFile = this.getAttribute('data-json');
    const templateFile = this.getAttribute('data-template');
    const [json, template] = await Promise.all([this.loadJson(jsonFile), this.loadTemplate(templateFile)]);

    console.info(jsonFile);

    this.render(json, template);
    
  }

  async loadJson(file) {
    const response = await fetch(file);
    return await response.json();
  }

  async loadTemplate(file) {
    const response = await fetch(file);
    return await response.text();
  }

  render(json, template) {
    let html = template;

    html = this.replacePlaceholders(html, json);
    this.shadowRoot.innerHTML = html;
  }

  replacePlaceholders(template, data) {
    const regex = /{{\s*(.*?)\s*}}/g;

    return template.replace(regex, (match, key) => {
      const keys = key.split('.');
      let value = data;

      for (const k of keys) {
        if (Array.isArray(value)) {
          return value.map(v => this.replacePlaceholders(match, v)).join('');
        } else {
          value = value[k];
        }

        if (value === undefined) return '';
      }

      return value;
    });
  }
}

customElements.define('json-resume-schema', JsonResumeSchemaComponent);
