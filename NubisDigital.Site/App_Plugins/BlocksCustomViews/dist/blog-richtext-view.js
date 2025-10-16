import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogRichTextCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const contentText = this.content?.content || '';
		// Strip HTML tags for preview - handle both string and object content
		const textContent = typeof contentText === 'string' ? contentText : (contentText?.markup || '');
		const cleanText = textContent.replace(/<[^>]*>/g, '');
		const textPreview = cleanText.substring(0, 200);
		const wordCount = cleanText.split(/\s+/).filter(w => w.length > 0).length;
		const charCount = cleanText.length;
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">📝</div>
					<div class="block-title">
						<h5>Rich Text</h5>
					</div>
				</div>
				<div class="content-preview">
					<p class="text-preview">${textPreview}${textPreview.length >= 200 ? '...' : ''}</p>
				</div>
				<div class="meta">
					<span class="badge">${wordCount} word${wordCount !== 1 ? 's' : ''}</span>
					<span class="badge">${charCount} char${charCount !== 1 ? 's' : ''}</span>
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
				pointer-events: none;
			}
			:host * {
				pointer-events: none;
			}
			.block-preview {
				display: flex;
				flex-direction: column;
				gap: 10px;
				padding: 14px;
				background: rgba(255, 255, 255, 0.7);
				backdrop-filter: blur(20px);
				-webkit-backdrop-filter: blur(20px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 10px;
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
			}
			.block-header {
				display: flex;
				align-items: center;
				gap: 10px;
			}
			.block-icon {
				font-size: 22px;
				flex-shrink: 0;
				filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
			}
			.block-title {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0;
				font-size: 11px;
				font-weight: 700;
				color: var(--uui-color-text-alt);
				text-transform: uppercase;
				letter-spacing: 0.8px;
			}
			.content-preview {
				padding: 10px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				flex: 1;
				overflow: hidden;
			}
			.text-preview {
				margin: 0;
				font-size: 12px;
				line-height: 1.6;
				color: var(--uui-color-text);
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
			}
			.meta {
				display: flex;
				gap: 6px;
				flex-wrap: wrap;
				padding-top: 6px;
				border-top: 1px solid rgba(148, 163, 184, 0.15);
			}
			.badge {
				display: inline-flex;
				align-items: center;
				padding: 3px 8px;
				font-size: 10px;
				font-weight: 600;
				border-radius: 10px;
				letter-spacing: 0.3px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				color: var(--uui-color-text);
				border: 1px solid rgba(148, 163, 184, 0.2);
			}
		`,
	];
}

customElements.define('blog-richtext-custom-view', BlogRichTextCustomView);