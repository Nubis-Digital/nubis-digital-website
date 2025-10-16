import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogQuoteCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const quoteText = this.content?.quote || 'Quote text';
		const author = this.content?.author || '';
		const wordCount = quoteText.split(/\s+/).filter(w => w.length > 0).length;
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">💬</div>
					<div class="block-title">
						<h5>Quote Block</h5>
					</div>
				</div>
				<div class="quote-display">
					<div class="quote-mark">"</div>
					<p class="quote-text">${quoteText}</p>
					${author ? html`
						<p class="author">— ${author}</p>
					` : ''}
				</div>
				<div class="meta">
					<span class="badge">${wordCount} word${wordCount !== 1 ? 's' : ''}</span>
					${author ? html`
						<span class="badge author-badge">✓ Has Author</span>
					` : html`
						<span class="badge">No Author</span>
					`}
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
				border-left: 4px solid;
				border-left-color: rgba(56, 189, 248, 0.6);
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
			.quote-display {
				position: relative;
				padding: 12px 12px 12px 20px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				flex: 1;
			}
			.quote-mark {
				position: absolute;
				left: 8px;
				top: 8px;
				font-size: 32px;
				line-height: 1;
				color: rgba(56, 189, 248, 0.3);
				font-family: Georgia, serif;
			}
			.quote-text {
				margin: 0 0 8px 0;
				font-size: 13px;
				line-height: 1.6;
				font-style: italic;
				color: var(--uui-color-text);
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
			.author {
				margin: 0;
				font-size: 12px;
				font-weight: 600;
				color: var(--uui-color-text-alt);
				text-align: right;
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
			.author-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				border: none;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
		`,
	];
}

customElements.define('blog-quote-custom-view', BlogQuoteCustomView);