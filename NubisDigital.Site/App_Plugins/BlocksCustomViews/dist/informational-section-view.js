import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class InformationalSectionCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headline = this.content?.headline || 'Informational Section';
		const contentText = this.content?.content || '';
		const hasImage = this.content?.image;
		const imagePosition = this.content?.imagePosition || 'Right';
		
		// Strip HTML and get preview
		const textPreview = typeof contentText === 'string' 
			? contentText.replace(/<[^>]*>/g, '').substring(0, 120)
			: '';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">📄</div>
					<div class="block-title">
						<h5>Informational Section</h5>
						<p class="headline">${headline}</p>
					</div>
				</div>
				
				${textPreview ? html`
					<div class="content-preview">
						<div class="preview-text">${textPreview}${textPreview.length >= 120 ? '...' : ''}</div>
					</div>
				` : ''}
				
				<div class="meta">
					${hasImage ? html`
						<span class="badge image-badge">📷 Image ${imagePosition}</span>
					` : ''}
					<span class="badge text-badge">📝 ${textPreview.length} chars</span>
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
				gap: 12px;
				padding: 16px;
				background: rgba(255, 255, 255, 0.7);
				backdrop-filter: blur(20px);
				-webkit-backdrop-filter: blur(20px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 12px;
				height: 100%;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
			}
			.block-header {
				display: flex;
				align-items: flex-start;
				gap: 12px;
			}
			.block-icon {
				font-size: 28px;
				flex-shrink: 0;
				filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
			}
			.block-title {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0 0 4px 0;
				font-size: 11px;
				font-weight: 700;
				color: var(--uui-color-text-alt);
				text-transform: uppercase;
				letter-spacing: 0.8px;
			}
			.headline {
				margin: 0;
				font-size: 15px;
				font-weight: 600;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.content-preview {
				padding: 12px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
			.preview-text {
				font-size: 12px;
				color: var(--uui-color-text-alt);
				line-height: 1.5;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
			.meta {
				display: flex;
				gap: 6px;
				flex-wrap: wrap;
				padding-top: 8px;
				border-top: 1px solid rgba(148, 163, 184, 0.15);
			}
			.badge {
				display: inline-flex;
				align-items: center;
				padding: 4px 10px;
				font-size: 11px;
				font-weight: 600;
				border-radius: 12px;
				letter-spacing: 0.3px;
			}
			.image-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.text-badge {
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				color: var(--uui-color-text);
				border: 1px solid rgba(148, 163, 184, 0.2);
			}
		`,
	];
}

customElements.define('informational-section-custom-view', InformationalSectionCustomView);