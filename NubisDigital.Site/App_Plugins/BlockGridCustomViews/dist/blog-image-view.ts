import { html, customElement, LitElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';

@customElement('blog-image-custom-view')
export class BlogImageCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {
	
	@property({ attribute: false })
	content?: UmbBlockDataType;

	render() {
		const image = this.content?.image;
		const caption = this.content?.caption || '';
		const imageUrl = image?.[0]?.url || '';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<span class="block-icon">🖼️</span>
					<span class="block-title">Image</span>
				</div>
				<div class="block-content">
					${imageUrl ? html`
						<div class="image-container">
							<img src="${imageUrl}?width=300" alt="${caption}" />
						</div>
						${caption ? html`<p class="caption">${caption}</p>` : ''}
					` : html`<div class="empty-image">
						<span class="empty-icon">🖼️</span>
						<p>No image selected</p>
					</div>`}
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
			background: #f9fafb;
			border: 1px solid #d1d5db;
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
			color: #7c3aed;
		}
		.block-icon {
			font-size: 18px;
		}
		.block-title {
			font-size: 13px;
		}
		.block-content {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.image-container {
			background: #e5e7eb;
			border-radius: 4px;
			overflow: hidden;
			margin-bottom: 8px;
		}
		.image-container img {
			width: 100%;
			height: auto;
			display: block;
		}
		.caption {
			font-size: 11px;
			color: #6b7280;
			font-style: italic;
			margin: 0;
			text-align: center;
		}
		.empty-image {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #9ca3af;
		}
		.empty-icon {
			font-size: 32px;
			opacity: 0.5;
		}
		.empty-image p {
			font-size: 12px;
			margin: 8px 0 0 0;
			font-style: italic;
		}
	`;
}

export default BlogImageCustomView;

declare global {
	interface HTMLElementTagNameMap {
		'blog-image-custom-view': BlogImageCustomView;
	}
}