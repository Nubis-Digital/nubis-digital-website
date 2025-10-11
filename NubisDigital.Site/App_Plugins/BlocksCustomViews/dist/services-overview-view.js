import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class ServicesOverviewCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headline = this.content?.headline || 'Services Overview';
		const services = this.content?.services || [];
		const serviceCount = Array.isArray(services) ? services.length : 0;
		
		return html`
			<div class="block-preview">
				<div class="block-icon">💼</div>
				<div class="block-content">
					<h5>Services Overview</h5>
					<p class="headline">${headline}</p>
					<p class="service-count">${serviceCount} service${serviceCount !== 1 ? 's' : ''}</p>
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
				align-items: flex-start;
				gap: 12px;
				padding: 12px;
				background: var(--uui-color-surface);
				border: 1px solid var(--uui-color-border);
				border-radius: 6px;
				height: 100%;
			}
			.block-icon {
				font-size: 24px;
				flex-shrink: 0;
			}
			.block-content {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0 0 4px 0;
				font-size: 14px;
				font-weight: 600;
				color: var(--uui-color-text);
			}
			p {
				margin: 0;
				font-size: 12px;
				color: var(--uui-color-text-alt);
			}
			.headline {
				font-weight: 600;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 4px;
			}
			.service-count {
				font-size: 11px;
				color: var(--uui-color-positive);
			}
		`,
	];
}

customElements.define('services-overview-custom-view', ServicesOverviewCustomView);