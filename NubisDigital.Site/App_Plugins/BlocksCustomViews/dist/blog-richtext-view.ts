import { html, customElement, LitElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';

@customElement('blog-richtext-custom-view')
export class BlogRichTextCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {
	
	@property({ attribute: false })
	content?: UmbBlockDataType;

	render() {
		const contentValue = this.content?.content || '';
		const preview = contentValue.replace(/<[^>]*>/g, '').substring(0, 150);
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<span class="block-icon">📝</span>
					<span class="block-title">Rich Text</span>
				</div>
				<div class="block-content">
					${preview ? html`<p>${preview}${preview.length >= 150 ? '...' : ''}</p>` : html`<p class="empty">No content yet...</p>`}
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
			background: white;
			border: 1px solid #e5e7eb;
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
			color: #1f2937;
		}
		.block-icon {
			font-size: 18px;
		}
		.block-title {
			font-size: 13px;
		}
		.block-content {
			flex: 1;
			font-size: 12px;
			color: #6b7280;
			line-height: 1.5;
		}
		.block-content p {
			margin: 0;
		}
		.empty {
			font-style: italic;
			color: #9ca3af;
		}
	`;
}

export default BlogRichTextCustomView;

declare global {
	interface HTMLElementTagNameMap {
		'blog-richtext-custom-view': BlogRichTextCustomView;
	}
}