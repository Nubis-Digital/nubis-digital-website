import { html, customElement, LitElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';

@customElement('blog-headline-custom-view')
export class BlogHeadlineCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {
	
	@property({ attribute: false })
	content?: UmbBlockDataType;

	render() {
		const headlineText = this.content?.headlineText || '';
		const headingLevel = this.content?.headingLevel || 'h2';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<span class="block-icon">📰</span>
					<span class="block-title">Headline (${headingLevel.toUpperCase()})</span>
				</div>
				<div class="block-content">
					${headlineText ? html`<div class="headline ${headingLevel}">${headlineText}</div>` : html`<p class="empty">No headline text yet...</p>`}
				</div>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
			height: 100%;
			box-sizing: border-box;
		}
		.block-preview {
			background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
			border: 1px solid #c7d2fe;
			border-radius: 8px;
			padding: 12px;
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.block-header {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 8px;
			font-weight: 600;
			color: #4338ca;
		}
		.block-icon {
			font-size: 18px;
		}
		.block-title {
			font-size: 13px;
		}
		.block-content {
			flex: 1;
		}
		.headline {
			font-weight: 700;
			color: #1e1b4b;
			line-height: 1.2;
		}
		.headline.h1 { font-size: 20px; }
		.headline.h2 { font-size: 18px; }
		.headline.h3 { font-size: 16px; }
		.headline.h4 { font-size: 14px; }
		.headline.h5 { font-size: 13px; }
		.headline.h6 { font-size: 12px; }
		.empty {
			font-style: italic;
			color: #a5b4fc;
			font-size: 12px;
			margin: 0;
		}
	`;
}

export default BlogHeadlineCustomView;

declare global {
	interface HTMLElementTagNameMap {
		'blog-headline-custom-view': BlogHeadlineCustomView;
	}
}