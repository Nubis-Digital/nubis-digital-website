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
		const serviceItems = this.content?.serviceItems?.contentData || [];
		const servicesStyle = this.content?.servicesStyle || 'grid';
		const itemCount = serviceItems.length;
		
		// Get first 3 service titles for preview
		const servicePreviews = serviceItems.slice(0, 3).map(item => {
			const values = item.values || [];
			const titleValue = values.find(v => v.alias === 'title');
			return titleValue?.value || 'Service';
		});
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">🛠️</div>
					<div class="block-title">
						<h5>Services Overview</h5>
						<p class="headline">${headline}</p>
					</div>
				</div>
				
				<div class="services-grid">
					${servicePreviews.map(title => html`
						<div class="service-card">
							<div class="service-icon">✓</div>
							<span class="service-title">${title}</span>
						</div>
					`)}
					${itemCount > 3 ? html`
						<div class="service-card more">
							<span class="more-count">+${itemCount - 3} more</span>
						</div>
					` : ''}
				</div>
				
				<div class="meta">
					<span class="badge count-badge">${itemCount} service${itemCount !== 1 ? 's' : ''}</span>
					<span class="badge style-badge">${servicesStyle} layout</span>
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
			.services-grid {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 8px;
				margin: 4px 0;
			}
			.service-card {
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 8px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				font-size: 12px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
			.service-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 20px;
				height: 20px;
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				border-radius: 6px;
				font-size: 10px;
				font-weight: bold;
				flex-shrink: 0;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.service-title {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--uui-color-text);
				font-weight: 500;
			}
			.service-card.more {
				justify-content: center;
				background: rgba(255, 255, 255, 0.3);
				border-style: dashed;
			}
			.more-count {
				color: var(--uui-color-text-alt);
				font-weight: 600;
				font-size: 11px;
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
			.count-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.style-badge {
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				color: var(--uui-color-text);
				border: 1px solid rgba(148, 163, 184, 0.2);
			}
		`,
	];
}

customElements.define('services-overview-custom-view', ServicesOverviewCustomView);