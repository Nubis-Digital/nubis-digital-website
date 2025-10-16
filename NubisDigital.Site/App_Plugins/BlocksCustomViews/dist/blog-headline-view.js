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
		const charCount = headlineText.length;
		
		// Map heading level to visual size
		const sizeMap = {
			'h1': '2XL',
			'h2': 'XL',
			'h3': 'LG',
			'h4': 'MD',
			'h5': 'SM',
			'h6': 'XS'
		};
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">📰</div>
					<div class="block-title">
						<h5>Headline</h5>
					</div>
				</div>
				<div class="headline-display">
					<p class="headline-text level-${headlineLevel}">${headlineText}</p>
				</div>
				<div class="meta">
					<span class="badge level-badge">${headlineLevel.toUpperCase()} (${sizeMap[headlineLevel]})</span>
					<span class="badge">${charCount} chars</span>
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
			.headline-display {
				padding: 12px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				flex: 1;
			}
			.headline-text {
				margin: 0;
				font-weight: 700;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				line-height: 1.3;
			}
			.level-h1 { font-size: 20px; }
			.level-h2 { font-size: 18px; }
			.level-h3 { font-size: 16px; }
			.level-h4 { font-size: 14px; }
			.level-h5 { font-size: 13px; }
			.level-h6 { font-size: 12px; }
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
			.level-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				border: none;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
		`,
	];
}

customElements.define('blog-headline-custom-view', BlogHeadlineCustomView);