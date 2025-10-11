import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogCodeCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const code = this.content?.code || '// Code snippet';
		const language = this.content?.language || 'text';
		// Get first few lines for preview
		const codePreview = code.split('\n').slice(0, 3).join('\n');
		const hasMore = code.split('\n').length > 3;
		
		return html`
			<div class="block-preview">
				<div class="block-icon">💻</div>
				<div class="block-content">
					<h5>Code Block <span class="language">${language}</span></h5>
					<pre class="code-preview">${codePreview}${hasMore ? '\n...' : ''}</pre>
				</div>
			</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				height: 100%;
				box-sizing: border-box;
			}
			.block-preview {
				display: flex;
				align-items: flex-start;
				gap: 12px;
				padding: 12px;
				background: var(--uui-color-surface);
				border: 1px solid var(--uui-color-border);
				border-radius: 6px;
				height: 100%;
			}
			.block-icon {
				font-size: 24px;
				flex-shrink: 0;
			}
			.block-content {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0 0 8px 0;
				font-size: 14px;
				font-weight: 600;
				color: var(--uui-color-text);
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.language {
				font-size: 11px;
				font-weight: 500;
				padding: 2px 6px;
				background: var(--uui-color-selected);
				color: var(--uui-color-selected-contrast);
				border-radius: 3px;
				text-transform: uppercase;
			}
			.code-preview {
				margin: 0;
				font-size: 11px;
				font-family: 'Courier New', monospace;
				color: var(--uui-color-text);
				background: var(--uui-color-surface-alt);
				padding: 8px;
				border-radius: 4px;
				overflow: hidden;
				white-space: pre;
				text-overflow: ellipsis;
			}
		`,
	];
}

customElements.define('blog-code-custom-view', BlogCodeCustomView);