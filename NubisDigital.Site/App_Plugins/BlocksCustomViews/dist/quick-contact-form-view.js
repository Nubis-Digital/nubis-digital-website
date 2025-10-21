import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class QuickContactFormCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const formTitle = this.content?.formTitle || 'Quick Contact Form';
		const formSubtitle = this.content?.formSubtitle || '';
		const submitButtonText = this.content?.submitButtonText || 'Get Started';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">✉️</div>
					<div class="block-title">
						<h5>Quick Contact Form</h5>
						<p class="title-text">${formTitle}</p>
					</div>
				</div>
				
				${formSubtitle ? html`
					<div class="subtitle">
						<p>${formSubtitle}</p>
					</div>
				` : ''}
				
				<div class="meta">
					<span class="badge cta-badge">📧 Email + Message</span>
					<span class="badge button-badge">${submitButtonText}</span>
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
				flex-direction: column;
				gap: 12px;
				padding: 16px;
				background: rgba(255, 255, 255, 0.7);
				backdrop-filter: blur(20px);
				-webkit-backdrop-filter: blur(20px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 12px;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
				height: 100%;
				transition: all 0.3s ease;
			}
			
			.block-preview:hover {
				transform: translateY(-2px);
				box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
			}
			
			.block-header {
				display: flex;
				align-items: flex-start;
				gap: 12px;
			}
			
			.block-icon {
				font-size: 32px;
				line-height: 1;
				flex-shrink: 0;
			}
			
			.block-title {
				flex: 1;
				min-width: 0;
			}
			
			.block-title h5 {
				margin: 0 0 4px 0;
				font-size: 13px;
				font-weight: 600;
				color: var(--uui-color-text);
				text-transform: uppercase;
				letter-spacing: 0.5px;
			}
			
			.title-text {
				margin: 0;
				font-size: 16px;
				font-weight: 600;
				color: var(--uui-color-text);
				line-height: 1.4;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.subtitle {
				padding: 8px 12px;
				background: rgba(148, 163, 184, 0.1);
				border-radius: 8px;
				border-left: 3px solid rgba(56, 189, 248, 0.5);
			}
			
			.subtitle p {
				margin: 0;
				font-size: 13px;
				color: var(--uui-color-text-alt);
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.meta {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
				padding-top: 8px;
				border-top: 1px solid rgba(148, 163, 184, 0.15);
			}
			
			.badge {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				padding: 4px 10px;
				border-radius: 6px;
				font-size: 11px;
				font-weight: 600;
				color: white;
				white-space: nowrap;
			}
			
			.cta-badge {
				background: linear-gradient(135deg, #38bdf8, #0ea5e9);
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			
			.button-badge {
				background: linear-gradient(135deg, #818cf8, #6366f1);
				box-shadow: 0 2px 8px rgba(129, 140, 248, 0.3);
			}
		`,
	];
}

customElements.define('quick-contact-form-custom-view', QuickContactFormCustomView);