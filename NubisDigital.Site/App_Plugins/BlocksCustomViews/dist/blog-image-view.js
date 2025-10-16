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
		const caption = this.content?.caption || '';
		const altText = this.content?.altText || '';
		const hasImage = this.content?.image;
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">🖼️</div>
					<div class="block-title">
						<h5>Image Block</h5>
					</div>
				</div>
				<div class="image-info">
					${caption ? html`
						<div class="info-row">
							<span class="label">Caption:</span>
							<span class="value">${caption}</span>
						</div>
					` : ''}
					${altText ? html`
						<div class="info-row">
							<span class="label">Alt Text:</span>
							<span class="value">${altText}</span>
						</div>
					` : ''}
					${!caption && !altText ? html`
						<div class="info-row empty">
							<span class="value">No caption or alt text provided</span>
						</div>
					` : ''}
				</div>
				<div class="meta">
					${hasImage ? html`
						<span class="badge image-badge">✓ Image Selected</span>
					` : html`
						<span class="badge warning-badge">⚠ No Image</span>
					`}
					${altText ? html`
						<span class="badge accessible-badge">♿ Accessible</span>
					` : ''}
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
			.image-info {
				padding: 10px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.info-row {
				display: flex;
				gap: 8px;
				font-size: 12px;
			}
			.info-row.empty {
				justify-content: center;
				font-style: italic;
				color: var(--uui-color-text-alt);
			}
			.label {
				font-weight: 600;
				color: var(--uui-color-text-alt);
				flex-shrink: 0;
			}
			.value {
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
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
			}
			.image-badge {
				background: linear-gradient(135deg, #10b981, #059669);
				color: white;
				box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
			}
			.warning-badge {
				background: linear-gradient(135deg, #f59e0b, #d97706);
				color: white;
				box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
			}
			.accessible-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
		`,
	];
}

customElements.define('blog-image-custom-view', BlogImageCustomView);