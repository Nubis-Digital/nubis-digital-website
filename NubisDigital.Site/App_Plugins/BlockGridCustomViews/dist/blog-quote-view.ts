import { html, customElement, LitElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';

@customElement('blog-quote-custom-view')
export class BlogQuoteCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {
	
	@property({ attribute: false })
	content?: UmbBlockDataType;

	render() {
		const quoteText = this.content?.quoteText || '';
		const quoteAttribution = this.content?.quoteAttribution || '';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<span class="block-icon">💬</span>
					<span class="block-title">Quote</span>
				</div>
				<div class="block-content">
					${quoteText ? html`
						<blockquote>
							<svg class="quote-icon" viewBox="0 0 32 32" fill="currentColor">
								<path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
							</svg>
							<p class="quote-text">"${quoteText}"</p>
							${quoteAttribution ? html`<footer class="attribution">— ${quoteAttribution}</footer>` : ''}
						</blockquote>
					` : html`<p class="empty">No quote text yet...</p>`}
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
			background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
			border-left: 4px solid #f59e0b;
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
			color: #92400e;
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
		blockquote {
			margin: 0;
			position: relative;
		}
		.quote-icon {
			width: 24px;
			height: 24px;
			color: #fbbf24;
			opacity: 0.3;
			position: absolute;
			top: -8px;
			left: -4px;
		}
		.quote-text {
			font-size: 14px;
			font-style: italic;
			color: #78350f;
			margin: 0 0 8px 0;
			padding-left: 20px;
			line-height: 1.4;
		}
		.attribution {
			font-size: 11px;
			color: #92400e;
			padding-left: 20px;
		}
		.empty {
			font-style: italic;
			color: #d97706;
			font-size: 12px;
			margin: 0;
		}
	`;
}

export default BlogQuoteCustomView;

declare global {
	interface HTMLElementTagNameMap {
		'blog-quote-custom-view': BlogQuoteCustomView;
	}
}