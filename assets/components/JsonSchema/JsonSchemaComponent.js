class JsonSchemaComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.jsonData = {};
    this.template = ''; // Initialize an empty string for the template
  }

  connectedCallback() {
    const jsonUrl = this.getAttribute('json-url');
    const templateUrl = this.getAttribute('template-url'); // New attribute for the template

    if (jsonUrl && templateUrl) {
      this.loadTemplate(templateUrl)
        .then(() => this.loadJson(jsonUrl));
    }
  }

  // Load the external HTML template
  async loadTemplate(url) {
    try {
      const response = await fetch(url);
      this.template = await response.text();
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  }

  // Load JSON from a provided URL
  async loadJson(url) {
    try {
      const response = await fetch(url);
      this.jsonData = await response.json();
      this.render();
    } catch (error) {
      console.error('Failed to load JSON:', error);
    }
  }

  // Render the content based on the loaded template and JSON data
  render() {
    if (!this.template || !this.jsonData || Object.keys(this.jsonData).length === 0) {
      this.shadowRoot.innerHTML = `<p>No template or JSON data loaded</p>`;
      return;
    }

    let content = this.template;

    // Replace placeholders with actual data
    content = content.replace(/{{(.*?)}}/g, (match, path) => this.getValue(path.trim()));

    this.shadowRoot.innerHTML = content;
  }

  // Method to get a value from the JSON data using a dot notation string
  getValue(path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], this.jsonData) || '';
  }
}

// Define the custom element
customElements.define('json-schema-component', JsonSchemaComponent);
