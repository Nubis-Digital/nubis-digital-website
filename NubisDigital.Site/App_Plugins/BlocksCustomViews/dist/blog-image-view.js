import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogImageCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const caption = this.content?.caption || 'Image';
		const altText = this.content?.altText || '';
		
		return html`
			<div class="block-preview">
				<div class="block-icon">🖼️</div>
				<div class="block-content">
					<h5>Image</h5>
					<p class="caption">${caption}</p>
					${altText ? html`<p class="alt-text">Alt: ${altText}</p>` : ''}
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
				margin: 0 0 4px 0;
				font-size: 14px;
				font-weight: 600;
				color: var(--uui-color-text);
			}
			p {
				margin: 0;
				font-size: 12px;
				color: var(--uui-color-text-alt);
			}
			.caption {
				font-weight: 500;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.alt-text {
				margin-top: 4px;
				font-style: italic;
			}
		`,
	];
}

customElements.define('blog-image-custom-view', BlogImageCustomView);