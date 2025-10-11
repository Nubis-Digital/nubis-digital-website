import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogHeadlineCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headlineText = this.content?.headline || 'Headline';
		const headlineLevel = this.content?.headlineLevel || 'h2';
		
		return html`
			<div class="block-preview">
				<div class="block-icon">📰</div>
				<div class="block-content">
					<h5>Headline (${headlineLevel.toUpperCase()})</h5>
					<p class="headline-preview">${headlineText}</p>
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
			.headline-preview {
				font-weight: 600;
				font-size: 14px;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`,
	];
}

customElements.define('blog-headline-custom-view', BlogHeadlineCustomView);