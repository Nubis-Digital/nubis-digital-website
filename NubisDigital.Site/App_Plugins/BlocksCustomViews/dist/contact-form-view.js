import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class ContactFormCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headline = this.content?.headline || 'Contact Form';
		const description = this.content?.description || '';
		const submitButtonText = this.content?.submitButtonText || 'Submit';
		const successMessage = this.content?.successMessage;
		
		// Form fields preview
		const formFields = [
			{ icon: '👤', label: 'Name' },
			{ icon: '📧', label: 'Email' },
			{ icon: '📝', label: 'Message' }
		];
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">✉️</div>
					<div class="block-title">
						<h5>Contact Form</h5>
						<p class="headline">${headline}</p>
					</div>
				</div>
				
				${description ? html`
					<div class="description">${description.substring(0, 80)}${description.length > 80 ? '...' : ''}</div>
				` : ''}
				
				<div class="form-preview">
					${formFields.map(field => html`
						<div class="form-field">
							<span class="field-icon">${field.icon}</span>
							<span class="field-label">${field.label}</span>
						</div>
					`)}
				</div>
				
				<div class="meta">
					<span class="badge button-badge">🔘 ${submitButtonText}</span>
					${successMessage ? html`
						<span class="badge success-badge">✓ Has Success Message</span>
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
			.description {
				font-size: 12px;
				color: var(--uui-color-text-alt);
				padding: 8px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				line-height: 1.4;
			}
			.form-preview {
				display: flex;
				flex-direction: column;
				gap: 6px;
				padding: 12px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
			.form-field {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 6px 8px;
				background: rgba(255, 255, 255, 0.6);
				backdrop-filter: blur(5px);
				-webkit-backdrop-filter: blur(5px);
				border: 1px solid rgba(148, 163, 184, 0.1);
				border-radius: 6px;
				font-size: 12px;
			}
			.field-icon {
				font-size: 14px;
				flex-shrink: 0;
			}
			.field-label {
				color: var(--uui-color-text);
				font-weight: 500;
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
			.button-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.success-badge {
				background: linear-gradient(135deg, #10b981, #059669);
				color: white;
				box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
			}
		`,
	];
}

customElements.define('contact-form-custom-view', ContactFormCustomView);